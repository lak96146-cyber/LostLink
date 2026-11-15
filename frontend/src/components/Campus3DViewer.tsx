import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CampusBuilding, CampusZone, RadarMarker, CampusRoute } from '../types';
import {
  Compass,
  Sun,
  Sunset,
  Moon,
  Layers,
  MapPin,
  Navigation,
  User,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  X
} from 'lucide-react';

interface Campus3DViewerProps {
  buildings: CampusBuilding[];
  zones?: CampusZone[];
  markers?: RadarMarker[];
  activeRoute?: CampusRoute | null;
  selectedBuildingId?: number | null;
  onSelectBuilding?: (building: CampusBuilding | null) => void;
  onSelectMarker?: (marker: RadarMarker) => void;
}

// Verified Campus Center: CGC University Jhanjeri
const CGC_LAT = 30.68114;
const CGC_LNG = 76.60584;
const CAMPUS_RADIUS = 1000.0; // 1km radius

// Convert GPS to 3D scene meters
function gpsToLocal(lat: number, lng: number): [number, number] {
  const latRad = (CGC_LAT * Math.PI) / 180;
  const x = (lng - CGC_LNG) * 111320.0 * Math.cos(latRad);
  const z = -(lat - CGC_LAT) * 111320.0;
  return [x, z];
}

export const Campus3DViewer: React.FC<Campus3DViewerProps> = ({
  buildings,
  zones = [],
  markers = [],
  activeRoute = null,
  selectedBuildingId = null,
  onSelectBuilding,
  onSelectMarker,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [timeMode, setTimeMode] = useState<'day' | 'sunset' | 'night'>('day');
  const [cameraView, setCameraView] = useState<'perspective' | 'top' | 'isometric'>('perspective');
  const [isFreeRoam, setIsFreeRoam] = useState<boolean>(false);
  const [activeBuildingInfo, setActiveBuildingInfo] = useState<CampusBuilding | null>(null);
  const [showRadarMarkers, setShowRadarMarkers] = useState<boolean>(true);
  const [showZones, setShowZones] = useState<boolean>(true);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const buildingMeshesRef = useRef<Map<number, THREE.Mesh>>(new Map());
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const routeLineRef = useRef<THREE.Line | null>(null);
  const characterRef = useRef<THREE.Group | null>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const animationFrameId = useRef<number | null>(null);

  // Lighting refs for time of day transitions
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  // Orbit controls state
  const isDragging = useRef<boolean>(false);
  const prevMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const cameraSpherical = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 400,
    theta: Math.PI / 4,
    phi: Math.PI / 3,
  });

  // Free roam character position & rotation
  const charPos = useRef<{ x: number; z: number; rotation: number }>({ x: 0, z: 0, rotation: 0 });

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    scene.fog = new THREE.FogExp2(0x0f172a, 0.0007);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 3000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const hemiLight = new THREE.HemisphereLight(0xfff5e6, 0x1e293b, 0.8);
    hemiLight.position.set(0, 500, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(300, 450, 200);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 50;
    dirLight.shadow.camera.far = 1200;
    dirLight.shadow.camera.left = -500;
    dirLight.shadow.camera.right = 500;
    dirLight.shadow.camera.top = 500;
    dirLight.shadow.camera.bottom = -500;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // 5. Ground Plane & 1,000 Meter Boundary Ring (CGC Campus Boundary)
    const groundGeo = new THREE.CircleGeometry(CAMPUS_RADIUS, 96);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x162238, // Stylized deep slate turf
      roughness: 0.85,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid accent overlay on ground
    const gridHelper = new THREE.PolarGridHelper(CAMPUS_RADIUS, 16, 8, 64, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = 0.2;
    scene.add(gridHelper);

    // Glowing 1,000m Boundary Perimeter Ring
    const ringGeo = new THREE.RingGeometry(CAMPUS_RADIUS - 3, CAMPUS_RADIUS + 3, 128);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const boundaryRing = new THREE.Mesh(ringGeo, ringMat);
    boundaryRing.rotation.x = -Math.PI / 2;
    boundaryRing.position.y = 0.5;
    scene.add(boundaryRing);

    // 6. Roads & Pathways
    createCampusRoads(scene);

    // 7. Sports Arena / Cricket Pitch Oval
    const [spoX, spoZ] = gpsToLocal(30.67980, 76.60440);
    const pitchGeo = new THREE.RingGeometry(25, 75, 48);
    const pitchMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
    const pitchMesh = new THREE.Mesh(pitchGeo, pitchMat);
    pitchMesh.rotation.x = -Math.PI / 2;
    pitchMesh.position.set(spoX, 0.3, spoZ);
    scene.add(pitchMesh);

    // 8. Markers Group
    const markersGroup = new THREE.Group();
    scene.add(markersGroup);
    markersGroupRef.current = markersGroup;

    // 9. Character Avatar for Free Roam
    createCharacterAvatar(scene);

    // 10. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Free Roam Movement
      if (isFreeRoam && characterRef.current) {
        handleCharacterMovement(delta);
      }

      // Pulse markers
      if (markersGroupRef.current) {
        markersGroupRef.current.children.forEach((child, i) => {
          child.position.y = 12 + Math.sin(clock.getElapsedTime() * 3 + i) * 2;
          child.rotation.y += 0.02;
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // Event Listeners for Interaction
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Buildings in Scene
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove existing buildings
    buildingMeshesRef.current.forEach((mesh) => scene.remove(mesh));
    buildingMeshesRef.current.clear();

    buildings.forEach((b) => {
      const [x, z] = gpsToLocal(b.latitude, b.longitude);
      const isSelected = b.id === selectedBuildingId;

      // Stylized Anime Architectural Building
      const buildingGroup = new THREE.Group();

      // Base Structure
      const h = b.heightMeters || 16;
      const w = b.widthMeters || 45;
      const d = b.depthMeters || 30;

      let bodyColor = 0xe2e8f0; // Clean off-white architectural concrete
      let roofColor = 0x334155; // Slate roof
      let accentColor = 0x6366f1; // Indigo trim

      if (b.category === 'ADMIN') {
        bodyColor = 0xf8fafc;
        roofColor = 0x1e3a8a; // Navy
        accentColor = 0x3b82f6;
      } else if (b.category === 'HOSTEL') {
        bodyColor = 0xf1f5f9;
        roofColor = 0x7c2d12; // Warm terracotta
        accentColor = 0xf97316;
      } else if (b.category === 'RECREATIONAL') {
        bodyColor = 0xecfdf5;
        roofColor = 0x065f46; // Forest emerald
        accentColor = 0x10b981;
      }

      const bodyGeo = new THREE.BoxGeometry(w, h, d);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x818cf8 : bodyColor,
        roughness: 0.4,
        metalness: 0.1,
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      bodyMesh.position.y = h / 2;
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      buildingGroup.add(bodyMesh);

      // Roof Overhang
      const roofGeo = new THREE.BoxGeometry(w + 3, 2, d + 3);
      const roofMat = new THREE.MeshStandardMaterial({
        color: roofColor,
        roughness: 0.5,
      });
      const roofMesh = new THREE.Mesh(roofGeo, roofMat);
      roofMesh.position.y = h + 1;
      roofMesh.castShadow = true;
      buildingGroup.add(roofMesh);

      // Entrance Steps / Podium
      const podiumGeo = new THREE.BoxGeometry(w + 6, 1.2, d + 6);
      const podiumMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
      const podiumMesh = new THREE.Mesh(podiumGeo, podiumMat);
      podiumMesh.position.y = 0.6;
      podiumMesh.receiveShadow = true;
      buildingGroup.add(podiumMesh);

      // Windows Pattern
      createBuildingWindows(buildingGroup, w, h, d, b.floors || 4);

      // If Selected: Anime Wireframe Hologram
      if (isSelected) {
        const wireGeo = new THREE.BoxGeometry(w + 4, h + 4, d + 4);
        const wireMat = new THREE.MeshBasicMaterial({
          color: 0x6366f1,
          wireframe: true,
          transparent: true,
          opacity: 0.6,
        });
        const wireMesh = new THREE.Mesh(wireGeo, wireMat);
        wireMesh.position.y = h / 2;
        buildingGroup.add(wireMesh);
      }

      // Add building signage floating text
      buildingGroup.position.set(x, 0, z);
      buildingGroup.userData = { building: b };
      scene.add(buildingGroup);

      // Store reference using bodyMesh for raycasting
      bodyMesh.userData = { building: b };
      buildingMeshesRef.current.set(b.id, bodyMesh);
    });
  }, [buildings, selectedBuildingId]);

  // Update Radar Markers (Real Item Reports)
  useEffect(() => {
    if (!markersGroupRef.current) return;
    const group = markersGroupRef.current;
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (!showRadarMarkers) return;

    markers.forEach((m) => {
      const [x, z] = gpsToLocal(m.latitude, m.longitude);
      const isLost = m.type === 'LOST';

      const markerGroup = new THREE.Group();
      markerGroup.position.set(x, 10, z);

      // Inverted Cone Marker
      const coneGeo = new THREE.ConeGeometry(3, 8, 8);
      coneGeo.rotateX(Math.PI);
      const coneMat = new THREE.MeshStandardMaterial({
        color: isLost ? 0xf43f5e : 0x10b981, // Red for Lost, Emerald for Found
        emissive: isLost ? 0x9f1239 : 0x065f46,
        emissiveIntensity: 0.8,
        metalness: 0.3,
        roughness: 0.2,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      markerGroup.add(cone);

      // Floating Glow Beacon Sphere
      const sphereGeo = new THREE.SphereGeometry(1.5, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: isLost ? 0xfecdd3 : 0xa7f3d0,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.y = 5;
      markerGroup.add(sphere);

      markerGroup.userData = { marker: m };
      group.add(markerGroup);
    });
  }, [markers, showRadarMarkers]);

  // Update Active Route Visualization
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    if (routeLineRef.current) {
      scene.remove(routeLineRef.current);
      routeLineRef.current = null;
    }

    if (activeRoute && activeRoute.routeFound && activeRoute.pathCoordinates.length > 1) {
      const points: THREE.Vector3[] = [];
      activeRoute.pathCoordinates.forEach(([lat, lng]) => {
        const [x, z] = gpsToLocal(lat, lng);
        points.push(new THREE.Vector3(x, 2, z));
      });

      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineDashedMaterial({
        color: 0x38bdf8, // Neon cyan route
        linewidth: 4,
        scale: 1,
        dashSize: 5,
        gapSize: 2,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      line.computeLineDistances();
      scene.add(line);
      routeLineRef.current = line;
    }
  }, [activeRoute]);

  // Time of Day Transitions (Day / Sunset / Night)
  useEffect(() => {
    if (!sceneRef.current || !dirLightRef.current || !hemiLightRef.current) return;
    const scene = sceneRef.current;
    const dir = dirLightRef.current;
    const hemi = hemiLightRef.current;

    if (timeMode === 'day') {
      scene.background = new THREE.Color(0x0f172a);
      scene.fog = new THREE.FogExp2(0x0f172a, 0.0007);
      hemi.color.setHex(0xfff5e6);
      hemi.groundColor.setHex(0x1e293b);
      hemi.intensity = 0.9;
      dir.color.setHex(0xffffff);
      dir.intensity = 1.4;
      dir.position.set(300, 450, 200);
    } else if (timeMode === 'sunset') {
      scene.background = new THREE.Color(0x311b38); // Twilight purple
      scene.fog = new THREE.FogExp2(0x311b38, 0.0009);
      hemi.color.setHex(0xfb923c); // Warm amber
      hemi.groundColor.setHex(0x3b0764);
      hemi.intensity = 0.8;
      dir.color.setHex(0xf97316); // Golden sunset
      dir.intensity = 1.6;
      dir.position.set(400, 150, 100);
    } else {
      // Night Mode
      scene.background = new THREE.Color(0x030712); // Midnight black
      scene.fog = new THREE.FogExp2(0x030712, 0.001);
      hemi.color.setHex(0x38bdf8);
      hemi.groundColor.setHex(0x030712);
      hemi.intensity = 0.3;
      dir.color.setHex(0x818cf8);
      dir.intensity = 0.4;
      dir.position.set(200, 400, 200);
    }
  }, [timeMode]);

  // Camera presets
  const setView = (mode: 'perspective' | 'top' | 'isometric') => {
    setCameraView(mode);
    if (mode === 'top') {
      cameraSpherical.current = { radius: 750, theta: 0, phi: 0.01 };
    } else if (mode === 'isometric') {
      cameraSpherical.current = { radius: 550, theta: Math.PI / 4, phi: Math.PI / 4 };
    } else {
      cameraSpherical.current = { radius: 450, theta: Math.PI / 4, phi: Math.PI / 3 };
    }
    updateCameraPosition();
  };

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = cameraSpherical.current;
    const x = cameraTarget.current.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = cameraTarget.current.y + radius * Math.cos(phi);
    const z = cameraTarget.current.z + radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(cameraTarget.current);
  };

  // Fly to building camera transition
  const flyToBuilding = (b: CampusBuilding) => {
    const [x, z] = gpsToLocal(b.latitude, b.longitude);
    cameraTarget.current.set(x, 10, z);
    cameraSpherical.current.radius = 180;
    cameraSpherical.current.phi = Math.PI / 3.5;
    updateCameraPosition();
    setActiveBuildingInfo(b);
    if (onSelectBuilding) onSelectBuilding(b);
  };

  // Mouse Orbit controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFreeRoam) return;
    isDragging.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || isFreeRoam) return;
    const deltaX = e.clientX - prevMousePos.current.x;
    const deltaY = e.clientY - prevMousePos.current.y;
    prevMousePos.current = { x: e.clientX, y: e.clientY };

    cameraSpherical.current.theta -= deltaX * 0.005;
    cameraSpherical.current.phi = Math.max(0.1, Math.min(Math.PI / 2.1, cameraSpherical.current.phi - deltaY * 0.005));
    updateCameraPosition();
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isFreeRoam) return;
    cameraSpherical.current.radius = Math.max(50, Math.min(950, cameraSpherical.current.radius + e.deltaY * 0.5));
    updateCameraPosition();
  };

  // Raycasting for Building & Marker Click
  const handleClick = (e: React.MouseEvent) => {
    if (!mountRef.current || !cameraRef.current || !sceneRef.current || isFreeRoam) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // Check radar markers first
    if (markersGroupRef.current && showRadarMarkers) {
      const markerHits = raycaster.intersectObjects(markersGroupRef.current.children, true);
      if (markerHits.length > 0) {
        let root = markerHits[0].object;
        while (root.parent && root.parent !== markersGroupRef.current) {
          root = root.parent;
        }
        if (root.userData && root.userData.marker) {
          if (onSelectMarker) onSelectMarker(root.userData.marker);
          return;
        }
      }
    }

    // Check buildings
    const meshes = Array.from(buildingMeshesRef.current.values());
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      const b: CampusBuilding = hit.userData.building;
      if (b) {
        flyToBuilding(b);
      }
    }
  };

  // Free Roam Character Setup
  const createCharacterAvatar = (scene: THREE.Scene) => {
    const charGroup = new THREE.Group();
    charGroup.visible = false;

    // Stylized Anime Explorer Character
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.5 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.3 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.8 });

    // Torso
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.7, 2, 8), bodyMat);
    torso.position.y = 2;
    charGroup.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), skinMat);
    head.position.y = 3.6;
    charGroup.add(head);

    // Anime Hair
    const hair = new THREE.Mesh(new THREE.ConeGeometry(0.9, 0.9, 8), hairMat);
    hair.position.set(0, 4.2, -0.2);
    charGroup.add(hair);

    scene.add(charGroup);
    characterRef.current = charGroup;
  };

  // Keyboard controls for Free Roam
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const handleCharacterMovement = (delta: number) => {
    if (!characterRef.current || !cameraRef.current) return;
    const speed = 40.0;
    const keys = keysPressed.current;

    let moveX = 0;
    let moveZ = 0;

    if (keys['w'] || keys['arrowup']) moveZ -= 1;
    if (keys['s'] || keys['arrowdown']) moveZ += 1;
    if (keys['a'] || keys['arrowleft']) moveX -= 1;
    if (keys['d'] || keys['arrowright']) moveX += 1;

    if (moveX !== 0 || moveZ !== 0) {
      const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= len;
      moveZ /= len;

      const newX = charPos.current.x + moveX * speed * delta;
      const newZ = charPos.current.z + moveZ * speed * delta;

      // 1000m Boundary check
      const distFromCenter = Math.sqrt(newX * newX + newZ * newZ);
      if (distFromCenter < CAMPUS_RADIUS - 10) {
        charPos.current.x = newX;
        charPos.current.z = newZ;
        charPos.current.rotation = Math.atan2(moveX, moveZ);

        characterRef.current.position.set(newX, 0, newZ);
        characterRef.current.rotation.y = charPos.current.rotation;

        // Follow camera
        cameraRef.current.position.set(newX - Math.sin(charPos.current.rotation) * 30, 18, newZ - Math.cos(charPos.current.rotation) * 30);
        cameraRef.current.lookAt(newX, 4, newZ);
      }
    }
  };

  const toggleFreeRoam = () => {
    const next = !isFreeRoam;
    setIsFreeRoam(next);
    if (characterRef.current) {
      characterRef.current.visible = next;
      if (next) {
        // Place character near Block 1 center
        charPos.current.x = 0;
        charPos.current.z = 20;
        characterRef.current.position.set(0, 0, 20);
      } else {
        setView('perspective');
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[580px] bg-slate-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl select-none">
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
      />

      {/* Top Floating Overlay: Campus Information & Center Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 text-white shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <div className="text-xs font-semibold tracking-wide text-slate-200">
              CGC University, Jhanjeri
            </div>
            <div className="text-[10px] text-slate-400">
              30.68114° N, 76.60584° E • 1.0 km Verified Perimeter
            </div>
          </div>
        </div>

        {/* Free Roam Hint */}
        {isFreeRoam && (
          <div className="px-3 py-1.5 rounded-lg bg-indigo-600/90 text-white text-xs font-medium backdrop-blur-md flex items-center gap-2 shadow-lg">
            <User className="w-3.5 h-3.5" />
            <span>Free Roam Active: Use [W, A, S, D] or Arrow Keys to walk</span>
          </div>
        )}
      </div>

      {/* Top Right Floating Controls: Day/Sunset/Night & Camera Presets */}
      <div className="absolute top-4 right-4 z-10 flex flex-wrap items-center gap-2">
        {/* Time of Day Toggle */}
        <div className="flex items-center bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-white/10 text-slate-300">
          <button
            onClick={() => setTimeMode('day')}
            title="Day Mode"
            className={`p-1.5 rounded-lg transition ${timeMode === 'day' ? 'bg-amber-500/20 text-amber-300' : 'hover:text-white'}`}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTimeMode('sunset')}
            title="Sunset Mode"
            className={`p-1.5 rounded-lg transition ${timeMode === 'sunset' ? 'bg-orange-500/20 text-orange-300' : 'hover:text-white'}`}
          >
            <Sunset className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTimeMode('night')}
            title="Night Mode"
            className={`p-1.5 rounded-lg transition ${timeMode === 'night' ? 'bg-indigo-500/20 text-indigo-300' : 'hover:text-white'}`}
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>

        {/* Camera Views */}
        <div className="flex items-center bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-white/10 text-slate-300 text-xs font-medium">
          <button
            onClick={() => setView('perspective')}
            className={`px-2.5 py-1.5 rounded-lg transition ${cameraView === 'perspective' && !isFreeRoam ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
          >
            3D Orbit
          </button>
          <button
            onClick={() => setView('top')}
            className={`px-2.5 py-1.5 rounded-lg transition ${cameraView === 'top' && !isFreeRoam ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
          >
            Map View
          </button>
          <button
            onClick={() => setView('isometric')}
            className={`px-2.5 py-1.5 rounded-lg transition ${cameraView === 'isometric' && !isFreeRoam ? 'bg-indigo-600 text-white' : 'hover:text-white'}`}
          >
            Isometric
          </button>
        </div>

        {/* Free Roam Button */}
        <button
          onClick={toggleFreeRoam}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition backdrop-blur-md shadow-lg ${
            isFreeRoam
              ? 'bg-rose-600 border-rose-500 text-white'
              : 'bg-slate-900/85 border-white/10 text-slate-200 hover:bg-slate-800'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>{isFreeRoam ? 'Exit Roam' : 'Free Roam'}</span>
        </button>
      </div>

      {/* Layer Toggles & Radar Visibility (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setShowRadarMarkers(!showRadarMarkers)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium backdrop-blur-md transition shadow-lg ${
            showRadarMarkers
              ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-900/85 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Lost Radar ({markers.length})</span>
        </button>

        <div className="px-3 py-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 text-slate-400 text-xs flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-[11px] text-slate-300">Lost</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-slate-300">Found</span>
          </div>
        </div>
      </div>

      {/* Selected Building Info Drawer (Bottom Right) */}
      {activeBuildingInfo && (
        <div className="absolute bottom-4 right-4 z-10 w-80 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/15 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-start justify-between">
            <div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {activeBuildingInfo.code}
              </span>
              <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                {activeBuildingInfo.name}
              </h3>
            </div>
            <button
              onClick={() => setActiveBuildingInfo(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            {activeBuildingInfo.description}
          </p>

          <div className="mt-3.5 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500 block">Category</span>
              <span className="font-medium text-slate-300">{activeBuildingInfo.category}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Floors</span>
              <span className="font-medium text-slate-300">{activeBuildingInfo.floors || 4} Levels</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Procedural Campus Roads Generator (Matching OSM Highways around CGC)
function createCampusRoads(scene: THREE.Scene) {
  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x334155, // Charcoal asphalt
    roughness: 0.9,
  });

  // Main Spine Boulevard (North-South)
  const mainRoadGeo = new THREE.PlaneGeometry(16, 700);
  const mainRoad = new THREE.Mesh(mainRoadGeo, roadMat);
  mainRoad.rotation.x = -Math.PI / 2;
  mainRoad.position.set(0, 0.1, 0);
  mainRoad.receiveShadow = true;
  scene.add(mainRoad);

  // Cross Connector Road (East-West)
  const crossRoadGeo = new THREE.PlaneGeometry(550, 14);
  const crossRoad = new THREE.Mesh(crossRoadGeo, roadMat);
  crossRoad.rotation.x = -Math.PI / 2;
  crossRoad.position.set(20, 0.1, -40);
  crossRoad.receiveShadow = true;
  scene.add(crossRoad);

  // Hostels Access Ring
  const ringRoadGeo = new THREE.PlaneGeometry(350, 10);
  const ringRoad = new THREE.Mesh(ringRoadGeo, roadMat);
  ringRoad.rotation.x = -Math.PI / 2;
  ringRoad.position.set(50, 0.1, 160);
  ringRoad.receiveShadow = true;
  scene.add(ringRoad);
}

// Windows Texture Generator on Building Mesh
function createBuildingWindows(group: THREE.Group, w: number, h: number, d: number, floors: number) {
  const winMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd, // Light blue glass
    emissive: 0x60a5fa,
    emissiveIntensity: 0.2,
    roughness: 0.1,
    metalness: 0.9,
  });

  const floorHeight = h / floors;
  for (let f = 1; f < floors; f++) {
    const y = f * floorHeight;
    // Front & Back Windows Ribbon
    const winFront = new THREE.Mesh(new THREE.PlaneGeometry(w - 6, floorHeight * 0.4), winMat);
    winFront.position.set(0, y, d / 2 + 0.1);
    group.add(winFront);

    const winBack = new THREE.Mesh(new THREE.PlaneGeometry(w - 6, floorHeight * 0.4), winMat);
    winBack.rotation.y = Math.PI;
    winBack.position.set(0, y, -d / 2 - 0.1);
    group.add(winBack);
  }
}
