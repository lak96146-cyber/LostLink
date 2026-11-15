package com.lostlink.service;

import com.lostlink.entity.*;
import com.lostlink.geospatial.CampusGeoService;
import com.lostlink.matching.SmartMatchEngine;
import com.lostlink.repository.*;
import com.lostlink.verification.ItemDnaService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DataSeederService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CampusBuildingRepository buildingRepository;
    private final CampusZoneRepository zoneRepository;
    private final CampusPathRepository pathRepository;
    private final LockerRecordRepository lockerRepository;
    private final ItemRepository itemRepository;
    private final ItemPrivateDetailRepository privateDetailRepository;
    private final MatchResultRepository matchResultRepository;
    private final UserAchievementRepository achievementRepository;
    private final SecurityAuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final SmartMatchEngine matchEngine;
    private final CampusGeoService geoService;

    public DataSeederService(UserRepository userRepository,
                             CampusBuildingRepository buildingRepository,
                             CampusZoneRepository zoneRepository,
                             CampusPathRepository pathRepository,
                             LockerRecordRepository lockerRepository,
                             ItemRepository itemRepository,
                             ItemPrivateDetailRepository privateDetailRepository,
                             MatchResultRepository matchResultRepository,
                             UserAchievementRepository achievementRepository,
                             SecurityAuditLogRepository auditLogRepository,
                             PasswordEncoder passwordEncoder,
                             SmartMatchEngine matchEngine,
                             CampusGeoService geoService) {
        this.userRepository = userRepository;
        this.buildingRepository = buildingRepository;
        this.zoneRepository = zoneRepository;
        this.pathRepository = pathRepository;
        this.lockerRepository = lockerRepository;
        this.itemRepository = itemRepository;
        this.privateDetailRepository = privateDetailRepository;
        this.matchResultRepository = matchResultRepository;
        this.achievementRepository = achievementRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.matchEngine = matchEngine;
        this.geoService = geoService;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        System.out.println(">>> LostLink DataSeeder: Initializing CGC Jhanjeri Campus Database...");

        // 1. Seed Demo Users
        User admin = new User("admin@cgc.edu.in", passwordEncoder.encode("Admin@123"), "Guardian Admin", "CGC-ADM-01", "Campus Security & Administration", RoleType.ROLE_ADMIN);
        admin.setTrustScore(100);
        admin.setGoodSamaritanPoints(500);
        userRepository.save(admin);

        User student1 = new User("aarav.sharma@cgc.edu.in", passwordEncoder.encode("Student@123"), "Aarav Sharma", "2104501", "Computer Science & Engineering", RoleType.ROLE_STUDENT);
        student1.setTrustScore(98);
        student1.setGoodSamaritanPoints(120);
        student1.setPhone("+91 98765 43210");
        userRepository.save(student1);

        User student2 = new User("diya.patel@cgc.edu.in", passwordEncoder.encode("Student@123"), "Diya Patel", "2104588", "Information Technology", RoleType.ROLE_STUDENT);
        student2.setTrustScore(95);
        student2.setGoodSamaritanPoints(85);
        student2.setPhone("+91 98765 43211");
        userRepository.save(student2);

        User student3 = new User("rohan.verma@cgc.edu.in", passwordEncoder.encode("Student@123"), "Rohan Verma", "2201304", "Mechanical Engineering", RoleType.ROLE_STUDENT);
        student3.setTrustScore(92);
        student3.setGoodSamaritanPoints(45);
        student3.setPhone("+91 98765 43212");
        userRepository.save(student3);

        // 2. Seed CGC Jhanjeri Campus Buildings (Grounded in Verified OSM Data)
        CampusBuilding b1 = new CampusBuilding();
        b1.setName("Block 1 - Admin & Central Library");
        b1.setCode("CGC-B1");
        b1.setCategory("ADMIN");
        b1.setLatitude(30.68114);
        b1.setLongitude(76.60584);
        b1.setHeightMeters(18.0);
        b1.setWidthMeters(50.0);
        b1.setDepthMeters(35.0);
        b1.setFloors(5);
        b1.setDescription("Central Administrative Headquarters, Registrar Office, Main Auditorium, Central Digital Library, and Primary Security Desk.");
        buildingRepository.save(b1);

        CampusBuilding b2 = new CampusBuilding();
        b2.setName("Block 2 - Computer Science & Engineering");
        b2.setCode("CGC-B2");
        b2.setCategory("ACADEMIC");
        b2.setLatitude(30.68210);
        b2.setLongitude(76.60630);
        b2.setHeightMeters(16.0);
        b2.setWidthMeters(45.0);
        b2.setDepthMeters(30.0);
        b2.setFloors(4);
        b2.setDescription("Department of Computer Science & Engineering, Advanced AI/ML Research Laboratories, Server Room, and Seminar Hall.");
        buildingRepository.save(b2);

        CampusBuilding b3 = new CampusBuilding();
        b3.setName("Block 3 - Management & Law");
        b3.setCode("CGC-B3");
        b3.setCategory("ACADEMIC");
        b3.setLatitude(30.68180);
        b3.setLongitude(76.60490);
        b3.setHeightMeters(15.0);
        b3.setWidthMeters(42.0);
        b3.setDepthMeters(28.0);
        b3.setFloors(4);
        b3.setDescription("Chandigarh School of Business, MBA Lecture Theatres, Moot Court, Faculty Lounge, and Corporate Relations Cell.");
        buildingRepository.save(b3);

        CampusBuilding b4 = new CampusBuilding();
        b4.setName("Block 4 - Applied Sciences & Labs");
        b4.setCode("CGC-B4");
        b4.setCategory("ACADEMIC");
        b4.setLatitude(30.68050);
        b4.setLongitude(76.60680);
        b4.setHeightMeters(16.0);
        b4.setWidthMeters(48.0);
        b4.setDepthMeters(32.0);
        b4.setFloors(4);
        b4.setDescription("Applied Sciences, Physics and Chemistry Labs, Mechanical Workshops, and Robotics Innovation Incubator.");
        buildingRepository.save(b4);

        CampusBuilding gh = new CampusBuilding();
        gh.setName("Girls Hostel Complex");
        gh.setCode("CGC-GH");
        gh.setCategory("HOSTEL");
        gh.setLatitude(30.68290);
        gh.setLongitude(76.60740);
        gh.setHeightMeters(20.0);
        gh.setWidthMeters(60.0);
        gh.setDepthMeters(35.0);
        gh.setFloors(6);
        gh.setDescription("Modern on-campus residence for women students with dining hall, recreational study lounge, and 24/7 security gate.");
        buildingRepository.save(gh);

        CampusBuilding bh = new CampusBuilding();
        bh.setName("Boys Hostel Block");
        bh.setCode("CGC-BH");
        bh.setCategory("HOSTEL");
        bh.setLatitude(30.68340);
        bh.setLongitude(76.60420);
        bh.setHeightMeters(20.0);
        bh.setWidthMeters(65.0);
        bh.setDepthMeters(38.0);
        bh.setFloors(6);
        bh.setDescription("Boys student accommodation wings, indoor badminton hall, gymnasium, and mess facility.");
        buildingRepository.save(bh);

        CampusBuilding sac = new CampusBuilding();
        sac.setName("Student Activity Center & Food Court");
        sac.setCode("CGC-SAC");
        sac.setCategory("RECREATIONAL");
        sac.setLatitude(30.68140);
        sac.setLongitude(76.60520);
        sac.setHeightMeters(12.0);
        sac.setWidthMeters(35.0);
        sac.setDepthMeters(35.0);
        sac.setFloors(2);
        sac.setDescription("Campus cafeteria, student clubs headquarters, Nescafe corner, stationary shop, and open amphitheatre.");
        buildingRepository.save(sac);

        CampusBuilding spo = new CampusBuilding();
        spo.setName("Sports Arena & Cricket Ground");
        spo.setCode("CGC-SPO");
        spo.setCategory("RECREATIONAL");
        spo.setLatitude(30.67980);
        spo.setLongitude(76.60440);
        spo.setHeightMeters(8.0);
        spo.setWidthMeters(80.0);
        spo.setDepthMeters(80.0);
        spo.setFloors(1);
        spo.setDescription("Full-size cricket ground, football turf, outdoor basketball & volleyball courts, and athlete pavilion.");
        buildingRepository.save(spo);

        // 3. Seed Campus Zones
        CampusZone z1 = new CampusZone();
        z1.setName("Zone A - Academic Core");
        z1.setCode("ZONE-A");
        z1.setCenterLat(30.68150);
        z1.setCenterLng(76.60560);
        z1.setRadiusMeters(180.0);
        z1.setColorHex("#6366F1");
        z1.setDescription("Central academic quadrangle encompassing Block 1, Block 2, and Block 3 lecture halls.");
        zoneRepository.save(z1);

        CampusZone z2 = new CampusZone();
        z2.setName("Zone B - Hostels & Residences");
        z2.setCode("ZONE-B");
        z2.setCenterLat(30.68310);
        z2.setCenterLng(76.60600);
        z2.setRadiusMeters(220.0);
        z2.setColorHex("#8B5CF6");
        z2.setDescription("Residential quarters for students, faculty residences, and night-access perimeter.");
        zoneRepository.save(z2);

        CampusZone z3 = new CampusZone();
        z3.setName("Zone C - Sports & Food Court");
        z3.setCode("ZONE-C");
        z3.setCenterLat(30.68060);
        z3.setCenterLng(76.60480);
        z3.setRadiusMeters(200.0);
        z3.setColorHex("#10B981");
        z3.setDescription("Recreational hub including Student Activity Center, cafeteria, and sports grounds.");
        zoneRepository.save(z3);

        // 4. Seed Verified Campus Paths (Pedestrian graph for Dijkstra shortest path)
        addPath("Main Boulevard Path", b1.getId(), b2.getId(), 120.0, "PAVED_WALKWAY");
        addPath("Library-Cafeteria Walk", b1.getId(), sac.getId(), 65.0, "PAVED_WALKWAY");
        addPath("Academic Central Spine", b1.getId(), b3.getId(), 110.0, "PAVED_WALKWAY");
        addPath("Engineering Workshop Link", b1.getId(), b4.getId(), 135.0, "PAVED_WALKWAY");
        addPath("CS to Girls Hostel Trail", b2.getId(), gh.getId(), 140.0, "PAVED_WALKWAY");
        addPath("Management to Boys Hostel Walk", b3.getId(), bh.getId(), 190.0, "PAVED_WALKWAY");
        addPath("SAC to Sports Arena Path", sac.getId(), spo.getId(), 185.0, "PAVED_WALKWAY");
        addPath("Block 4 to Sports Pavilion", b4.getId(), spo.getId(), 210.0, "ROAD");

        // 5. Seed Smart Lockers
        addLocker("LCK-B1-01", "Security Desk Vault, Block 1 Ground Floor", LockerStatus.AVAILABLE);
        addLocker("LCK-B1-02", "Security Desk Vault, Block 1 Ground Floor", LockerStatus.AVAILABLE);
        addLocker("LCK-B1-03", "Electronic Safe Compartment, Block 1 Room 102", LockerStatus.AVAILABLE);
        addLocker("LCK-B2-01", "Lab Attendant Desk, Block 2 First Floor", LockerStatus.AVAILABLE);

        // 6. Seed Realistic Reports & Item DNA
        // Report 1: Lost MacBook by Aarav Sharma
        Item lostLaptop = new Item();
        lostLaptop.setTitle("Apple MacBook Air M2 13-inch (Space Grey)");
        lostLaptop.setType(ItemType.LOST);
        lostLaptop.setCategory("Electronics");
        lostLaptop.setDescription("Space Grey 13-inch MacBook Air with an anime cyberpunk sticker on the top right lid and a small scratch near the MagSafe charging port. In a dark navy felt sleeve.");
        lostLaptop.setBrand("Apple");
        lostLaptop.setColor("Space Grey");
        lostLaptop.setDateLostOrFound(LocalDate.now().minusDays(1));
        lostLaptop.setLocationName("Block 2 - Computer Science & Engineering (Lab 3)");
        lostLaptop.setBuildingId(b2.getId());
        lostLaptop.setCampusZone("Zone A - Academic Core");
        lostLaptop.setLatitude(30.68210);
        lostLaptop.setLongitude(76.60630);
        lostLaptop.setUrgency(UrgencyLevel.CRITICAL);
        lostLaptop.setIsCritical(true);
        lostLaptop.setStatus(ItemStatus.REPORTED);
        lostLaptop.setReporter(student1);
        itemRepository.save(lostLaptop);

        ItemPrivateDetail laptopDna = new ItemPrivateDetail();
        laptopDna.setItemId(lostLaptop.getId());
        laptopDna.setSerialNumberHash(ItemDnaService.hashSecret("C02G9988MD6T"));
        laptopDna.setSerialNumberHint("C02G***");
        laptopDna.setDistinctiveMarks("Cyberpunk anime sticker on top lid, tiny diagonal hairline scratch right above MagSafe port");
        laptopDna.setSecretNotes("Contains university CS assignment repo 'LostLink-Project' in Documents directory");
        privateDetailRepository.save(laptopDna);

        // Report 2: Found Laptop by Diya Patel (Matches Report 1!)
        Item foundLaptop = new Item();
        foundLaptop.setTitle("Space Grey MacBook in Navy Protective Sleeve");
        foundLaptop.setType(ItemType.FOUND);
        foundLaptop.setCategory("Electronics");
        foundLaptop.setDescription("Found a Space Grey MacBook Air inside a dark navy sleeve on a study desk on the ground floor of Block 2 near the computer labs. Laptop is password protected.");
        foundLaptop.setBrand("Apple");
        foundLaptop.setColor("Space Grey");
        foundLaptop.setDateLostOrFound(LocalDate.now().minusDays(1));
        foundLaptop.setLocationName("Block 2 - Computer Science & Engineering (Ground Floor)");
        foundLaptop.setBuildingId(b2.getId());
        foundLaptop.setCampusZone("Zone A - Academic Core");
        foundLaptop.setLatitude(30.68205);
        foundLaptop.setLongitude(76.60625);
        foundLaptop.setUrgency(UrgencyLevel.HIGH);
        foundLaptop.setStatus(ItemStatus.REPORTED);
        foundLaptop.setReporter(student2);
        itemRepository.save(foundLaptop);

        // Precompute SmartMatch between lostLaptop and foundLaptop
        MatchResult match = matchEngine.evaluateMatch(lostLaptop, foundLaptop);
        matchResultRepository.save(match);

        // Report 3: Lost ID Card (Critical Item)
        Item lostId = new Item();
        lostId.setTitle("CGC Student Identity Card (Rohan Verma - Mech Eng)");
        lostId.setType(ItemType.LOST);
        lostId.setCategory("ID cards");
        lostId.setDescription("Official CGC Jhanjeri student identity card inside a transparent plastic holder with blue lanyard. Roll No 2201304.");
        lostId.setBrand("CGC University");
        lostId.setColor("Blue");
        lostId.setDateLostOrFound(LocalDate.now());
        lostId.setLocationName("Student Activity Center & Food Court");
        lostId.setBuildingId(sac.getId());
        lostId.setCampusZone("Zone C - Sports & Food Court");
        lostId.setLatitude(30.68140);
        lostId.setLongitude(76.60520);
        lostId.setUrgency(UrgencyLevel.CRITICAL);
        lostId.setIsCritical(true);
        lostId.setStatus(ItemStatus.REPORTED);
        lostId.setReporter(student3);
        itemRepository.save(lostId);

        // Report 4: Found Watch near Sports Complex
        Item foundWatch = new Item();
        foundWatch.setTitle("Casio Vintage Silver Digital Wristwatch");
        foundWatch.setType(ItemType.FOUND);
        foundWatch.setCategory("Accessories");
        foundWatch.setDescription("Silver stainless steel digital wristwatch found near the spectator seating bench of the Cricket Ground.");
        foundWatch.setBrand("Casio");
        foundWatch.setColor("Silver");
        foundWatch.setDateLostOrFound(LocalDate.now().minusDays(2));
        foundWatch.setLocationName("Sports Arena & Cricket Ground");
        foundWatch.setBuildingId(spo.getId());
        foundWatch.setCampusZone("Zone C - Sports & Food Court");
        foundWatch.setLatitude(30.67980);
        foundWatch.setLongitude(76.60440);
        foundWatch.setUrgency(UrgencyLevel.LOW);
        foundWatch.setStatus(ItemStatus.REPORTED);
        foundWatch.setReporter(student1);
        itemRepository.save(foundWatch);

        // 7. Seed Achievements
        achievementRepository.save(new UserAchievement(student1.getId(), "FIRST_REPORT", "Campus Observer", "Submitted your first campus lost or found report.", "eye"));
        achievementRepository.save(new UserAchievement(student2.getId(), "GOOD_SAMARITAN", "Honorable Finder", "Turned in a valuable item found on college premises.", "shield"));

        // 8. Audit Log
        auditLogRepository.save(new SecurityAuditLog(
            admin.getId(), "SYSTEM_INITIALIZED", "127.0.0.1", "CGC Jhanjeri Campus Recovery Ecosystem initialized with OpenStreetMap baseline data."
        ));

        System.out.println(">>> LostLink DataSeeder: Successfully populated database with verified CGC Jhanjeri campus data and demo records.");
    }

    private void addPath(String name, Long fromId, Long toId, double dist, String type) {
        CampusPath p = new CampusPath();
        p.setName(name);
        p.setFromBuildingId(fromId);
        p.setToBuildingId(toId);
        p.setDistanceMeters(dist);
        p.setPathType(type);
        p.setIsAccessible(true);
        pathRepository.save(p);
    }

    private void addLocker(String ref, String loc, LockerStatus status) {
        LockerRecord l = new LockerRecord();
        l.setLockerReference(ref);
        l.setPhysicalLocation(loc);
        l.setStatus(status);
        lockerRepository.save(l);
    }
}
