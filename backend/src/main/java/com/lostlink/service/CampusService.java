package com.lostlink.service;

import com.lostlink.dto.CampusRouteDTO;
import com.lostlink.entity.*;
import com.lostlink.geospatial.CampusGeoService;
import com.lostlink.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class CampusService {

    private final CampusBuildingRepository buildingRepository;
    private final CampusZoneRepository zoneRepository;
    private final CampusPathRepository pathRepository;
    private final ItemRepository itemRepository;
    private final CampusGeoService geoService;

    public CampusService(CampusBuildingRepository buildingRepository,
                         CampusZoneRepository zoneRepository,
                         CampusPathRepository pathRepository,
                         ItemRepository itemRepository,
                         CampusGeoService geoService) {
        this.buildingRepository = buildingRepository;
        this.zoneRepository = zoneRepository;
        this.pathRepository = pathRepository;
        this.itemRepository = itemRepository;
        this.geoService = geoService;
    }

    @Transactional(readOnly = true)
    public List<CampusBuilding> getAllBuildings() {
        return buildingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<CampusZone> getAllZones() {
        return zoneRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<CampusPath> getAllPaths() {
        return pathRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getLostRadarData() {
        List<Item> itemsWithCoords = itemRepository.findAllWithCoordinates();
        List<Map<String, Object>> markers = new ArrayList<>();

        for (Item item : itemsWithCoords) {
            // Verify item is within 1000m radius of CGC Jhanjeri
            if (geoService.isWithinCampusBoundary(item.getLatitude(), item.getLongitude())) {
                double[] local3D = geoService.toLocal3DCoordinates(item.getLatitude(), item.getLongitude());

                Map<String, Object> marker = new HashMap<>();
                marker.put("id", item.getId());
                marker.put("title", item.getTitle());
                marker.put("type", item.getType().name());
                marker.put("category", item.getCategory());
                marker.put("status", item.getStatus().name());
                marker.put("locationName", item.getLocationName());
                marker.put("latitude", item.getLatitude());
                marker.put("longitude", item.getLongitude());
                marker.put("localX", local3D[0]);
                marker.put("localZ", local3D[1]);
                marker.put("urgency", item.getUrgency().name());
                marker.put("isCritical", item.getIsCritical());
                marker.put("imageUrl", item.getImageUrl());
                marker.put("dateLostOrFound", item.getDateLostOrFound());
                markers.add(marker);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("campusCenter", Map.of(
            "name", "CGC University, Jhanjeri, Mohali, Punjab",
            "latitude", CampusGeoService.CGC_CENTER_LAT,
            "longitude", CampusGeoService.CGC_CENTER_LNG,
            "worldRadiusMeters", CampusGeoService.CAMPUS_RADIUS_METERS
        ));
        result.put("markers", markers);
        result.put("totalMarkers", markers.size());

        return result;
    }

    @Transactional(readOnly = true)
    public CampusRouteDTO getRouteBetweenBuildings(Long fromBuildingId, Long toBuildingId) {
        return geoService.findShortestWalkingRoute(fromBuildingId, toBuildingId);
    }
}
