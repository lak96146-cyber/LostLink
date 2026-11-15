import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { CampusBuilding, CampusZone, RadarMarker, CampusRoute, ItemResponse } from '../types';
import { Campus3DViewer } from '../components/Campus3DViewer';
import { ItemModal } from '../components/ItemModal';
import {
  Compass,
  Navigation,
  MapPin,
  Search,
  Layers,
  ArrowRight,
  Info,
  Clock,
  Footprints,
  ShieldAlert,
  Building,
  RotateCcw
} from 'lucide-react';

export const CampusVersePage: React.FC = () => {
  const [buildings, setBuildings] = useState<CampusBuilding[]>([]);
  const [zones, setZones] = useState<CampusZone[]>([]);
  const [markers, setMarkers] = useState<RadarMarker[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding | null>(null);
  const [selectedMarkerItem, setSelectedMarkerItem] = useState<ItemResponse | null>(null);

  // Navigation Route State
  const [fromBuildingId, setFromBuildingId] = useState<number | ''>('');
  const [toBuildingId, setToBuildingId] = useState<number | ''>('');
  const [activeRoute, setActiveRoute] = useState<CampusRoute | null>(null);
  const [routeLoading, setRouteLoading] = useState<boolean>(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Filter building search
  const [buildingQuery, setBuildingQuery] = useState<string>('');

  useEffect(() => {
    loadCampusData();
  }, []);

  const loadCampusData = async () => {
    try {
      const bRes = await api.getCampusBuildings();
      setBuildings(bRes);

      const zRes = await api.getCampusZones();
      setZones(zRes);

      const radarRes = await api.getLostRadarData();
      setMarkers(radarRes.markers || []);

      if (bRes.length >= 2) {
        setFromBuildingId(bRes[0].id);
        setToBuildingId(bRes[1].id);
      }
    } catch (e) {
      console.error('Error loading campus data', e);
    }
  };

  const handleCalculateRoute = async () => {
    if (!fromBuildingId || !toBuildingId) return;
    setRouteLoading(true);
    setRouteError(null);
    try {
      const route = await api.getCampusRoute(Number(fromBuildingId), Number(toBuildingId));
      if (!route.routeFound) {
        setRouteError(route.directions[0] || 'No verified route available on campus pathway graph.');
      }
      setActiveRoute(route);
    } catch (err: any) {
      setRouteError('Failed to compute route.');
    } finally {
      setRouteLoading(false);
    }
  };

  const handleMarkerClick = async (marker: RadarMarker) => {
    try {
      const item = await api.getItemById(marker.id);
      setSelectedMarkerItem(item);
    } catch (e) {
      console.error('Error loading item details', e);
    }
  };

  const filteredBuildings = buildings.filter((b) =>
    b.name.toLowerCase().includes(buildingQuery.toLowerCase()) ||
    b.code.toLowerCase().includes(buildingQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Compass className="w-3 h-3 text-indigo-400" />
              <span>CampusVerse 3D Digital Twin</span>
            </span>
            <span className="text-xs text-slate-400">CGC University, Jhanjeri, Mohali</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Geospatial Campus Twin & Lost Radar</h1>
        </div>

        <div className="text-right text-[11px] text-slate-400 hidden sm:block">
          <div>Boundary: <strong className="text-slate-200">1,000m World Radius</strong></div>
          <div>Data Source: <strong className="text-indigo-400">OpenStreetMap & Verified Geodesy</strong></div>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="w-full h-[620px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        <Campus3DViewer
          buildings={buildings}
          zones={zones}
          markers={markers}
          activeRoute={activeRoute}
          selectedBuildingId={selectedBuilding?.id}
          onSelectBuilding={(b) => setSelectedBuilding(b)}
          onSelectMarker={handleMarkerClick}
        />
      </div>

      {/* Interactive Controls Grid Below Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Campus Pedestrian Route Planner */}
        <div className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-indigo-400" />
              <span>Campus Walking Navigation</span>
            </h3>
            <span className="text-[10px] text-slate-500">Dijkstra Shortest Path</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Starting Facility</label>
              <select
                value={fromBuildingId}
                onChange={(e) => setFromBuildingId(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Destination Facility</label>
              <select
                value={toBuildingId}
                onChange={(e) => setToBuildingId(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCalculateRoute}
              disabled={routeLoading || !fromBuildingId || !toBuildingId}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Footprints className="w-4 h-4" />
              <span>{routeLoading ? 'Calculating Pathway...' : 'Highlight Route in 3D'}</span>
            </button>

            {routeError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">
                {routeError}
              </div>
            )}

            {activeRoute && activeRoute.routeFound && (
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-indigo-500/20 text-xs space-y-2">
                <div className="flex items-center justify-between text-indigo-300 font-semibold">
                  <span>Distance: {activeRoute.totalDistanceMeters}m</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>~{activeRoute.estimatedDurationMinutes} mins walk</span>
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-white/5">
                  {activeRoute.directions.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-400 font-mono">{idx + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center & Right Column: Campus Buildings Directory */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-900/90 border border-white/10 p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" />
                <span>CGC Jhanjeri Campus Facilities</span>
              </h3>
              <p className="text-[11px] text-slate-400">Click any building to fly the 3D camera directly to its coordinates</p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={buildingQuery}
                onChange={(e) => setBuildingQuery(e.target.value)}
                placeholder="Search facilities..."
                className="bg-slate-950 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-52"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
            {filteredBuildings.map((b) => {
              const isSelected = selectedBuilding?.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBuilding(b)}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                      : 'bg-slate-950/60 border-white/5 text-slate-300 hover:border-white/20 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-slate-800 text-indigo-300 border border-white/5">
                      {b.code}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{b.category}</span>
                  </div>
                  <h4 className="font-bold text-white text-xs">{b.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{b.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Attribution notice */}
      <div className="text-center text-[11px] text-slate-500 pt-2">
        Geospatial Footprints & Pathways derived from © OpenStreetMap Contributors • Bounded to 1,000m radius of CGC University Jhanjeri
      </div>

      {/* Item Modal on Clicking Radar Marker */}
      <ItemModal
        item={selectedMarkerItem}
        onClose={() => setSelectedMarkerItem(null)}
        onClaimSuccess={() => loadCampusData()}
      />
    </div>
  );
};
