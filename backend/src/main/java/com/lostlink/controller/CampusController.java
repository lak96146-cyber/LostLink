package com.lostlink.controller;

import com.lostlink.dto.CampusRouteDTO;
import com.lostlink.entity.CampusBuilding;
import com.lostlink.entity.CampusPath;
import com.lostlink.entity.CampusZone;
import com.lostlink.service.CampusService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/campus")
public class CampusController {

    private final CampusService campusService;

    public CampusController(CampusService campusService) {
        this.campusService = campusService;
    }

    @GetMapping("/buildings")
    public ResponseEntity<List<CampusBuilding>> getBuildings() {
        return ResponseEntity.ok(campusService.getAllBuildings());
    }

    @GetMapping("/zones")
    public ResponseEntity<List<CampusZone>> getZones() {
        return ResponseEntity.ok(campusService.getAllZones());
    }

    @GetMapping("/paths")
    public ResponseEntity<List<CampusPath>> getPaths() {
        return ResponseEntity.ok(campusService.getAllPaths());
    }

    @GetMapping("/radar")
    public ResponseEntity<Map<String, Object>> getLostRadarData() {
        return ResponseEntity.ok(campusService.getLostRadarData());
    }

    @GetMapping("/route")
    public ResponseEntity<CampusRouteDTO> getRoute(
        @RequestParam Long from,
        @RequestParam Long to
    ) {
        return ResponseEntity.ok(campusService.getRouteBetweenBuildings(from, to));
    }
}
