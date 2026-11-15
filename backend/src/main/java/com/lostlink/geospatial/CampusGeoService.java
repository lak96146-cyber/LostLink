package com.lostlink.geospatial;

import com.lostlink.dto.CampusRouteDTO;
import com.lostlink.entity.CampusBuilding;
import com.lostlink.entity.CampusPath;
import com.lostlink.repository.CampusBuildingRepository;
import com.lostlink.repository.CampusPathRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CampusGeoService {

    // Verified CGC Jhanjeri Campus Coordinates
    public static final double CGC_CENTER_LAT = 30.68114;
    public static final double CGC_CENTER_LNG = 76.60584;
    public static final double CAMPUS_RADIUS_METERS = 1000.0;

    private final CampusBuildingRepository buildingRepository;
    private final CampusPathRepository pathRepository;

    public CampusGeoService(CampusBuildingRepository buildingRepository, CampusPathRepository pathRepository) {
        this.buildingRepository = buildingRepository;
        this.pathRepository = pathRepository;
    }

    public boolean isWithinCampusBoundary(Double lat, Double lng) {
        if (lat == null || lng == null) return false;
        double dist = calculateHaversineDistance(CGC_CENTER_LAT, CGC_CENTER_LNG, lat, lng);
        return dist <= CAMPUS_RADIUS_METERS;
    }

    public double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371000.0;
        double phi1 = Math.toRadians(lat1);
        double phi2 = Math.toRadians(lat2);
        double deltaPhi = Math.toRadians(lat2 - lat1);
        double deltaLambda = Math.toRadians(lon2 - lon1);

        double a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                   Math.cos(phi1) * Math.cos(phi2) *
                   Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    // Convert GPS (lat, lng) to local 3D world meters centered at CGC Jhanjeri
    public double[] toLocal3DCoordinates(double lat, double lng) {
        double latRad = Math.toRadians(CGC_CENTER_LAT);
        double xMeters = (lng - CGC_CENTER_LNG) * 111320.0 * Math.cos(latRad);
        double zMeters = -(lat - CGC_CENTER_LAT) * 111320.0;
        return new double[]{ Math.round(xMeters * 100.0) / 100.0, Math.round(zMeters * 100.0) / 100.0 };
    }

    // Convert local 3D meters back to GPS (lat, lng)
    public double[] toGpsCoordinates(double xMeters, double zMeters) {
        double latRad = Math.toRadians(CGC_CENTER_LAT);
        double lat = CGC_CENTER_LAT - (zMeters / 111320.0);
        double lng = CGC_CENTER_LNG + (xMeters / (111320.0 * Math.cos(latRad)));
        return new double[]{ lat, lng };
    }

    // Dijkstra Shortest Path Navigation over campus pathways
    public CampusRouteDTO findShortestWalkingRoute(Long fromBuildingId, Long toBuildingId) {
        CampusRouteDTO response = new CampusRouteDTO();
        response.setFromBuildingId(fromBuildingId);
        response.setToBuildingId(toBuildingId);

        Optional<CampusBuilding> optFrom = buildingRepository.findById(fromBuildingId);
        Optional<CampusBuilding> optTo = buildingRepository.findById(toBuildingId);

        if (optFrom.isEmpty() || optTo.isEmpty()) {
            response.setRouteFound(false);
            response.setDirections(List.of("Start or destination building could not be found."));
            return response;
        }

        CampusBuilding fromBuilding = optFrom.get();
        CampusBuilding toBuilding = optTo.get();
        response.setFromBuildingName(fromBuilding.getName());
        response.setToBuildingName(toBuilding.getName());

        if (fromBuildingId.equals(toBuildingId)) {
            response.setRouteFound(true);
            response.setTotalDistanceMeters(0.0);
            response.setEstimatedDurationMinutes(0);
            response.setDirections(List.of("You are already at " + fromBuilding.getName() + "."));
            response.setPathCoordinates(List.of(new double[]{ fromBuilding.getLatitude(), fromBuilding.getLongitude() }));
            return response;
        }

        // Build adjacency graph
        List<CampusPath> allPaths = pathRepository.findAll();
        Map<Long, List<Edge>> graph = new HashMap<>();

        for (CampusPath p : allPaths) {
            graph.computeIfAbsent(p.getFromBuildingId(), k -> new ArrayList<>()).add(new Edge(p.getToBuildingId(), p.getDistanceMeters(), p));
            graph.computeIfAbsent(p.getToBuildingId(), k -> new ArrayList<>()).add(new Edge(p.getFromBuildingId(), p.getDistanceMeters(), p));
        }

        // Dijkstra algorithm
        Map<Long, Double> distances = new HashMap<>();
        Map<Long, Long> previousNodes = new HashMap<>();
        Map<Long, CampusPath> pathUsed = new HashMap<>();
        PriorityQueue<NodeDistance> pq = new PriorityQueue<>(Comparator.comparingDouble(nd -> nd.dist));

        distances.put(fromBuildingId, 0.0);
        pq.add(new NodeDistance(fromBuildingId, 0.0));

        while (!pq.isEmpty()) {
            NodeDistance current = pq.poll();
            if (current.buildingId.equals(toBuildingId)) break;

            if (current.dist > distances.getOrDefault(current.buildingId, Double.MAX_VALUE)) continue;

            List<Edge> edges = graph.getOrDefault(current.buildingId, Collections.emptyList());
            for (Edge edge : edges) {
                double newDist = current.dist + edge.weight;
                if (newDist < distances.getOrDefault(edge.targetId, Double.MAX_VALUE)) {
                    distances.put(edge.targetId, newDist);
                    previousNodes.put(edge.targetId, current.buildingId);
                    pathUsed.put(edge.targetId, edge.path);
                    pq.add(new NodeDistance(edge.targetId, newDist));
                }
            }
        }

        if (!distances.containsKey(toBuildingId)) {
            // No verified route through campus path graph
            response.setRouteFound(false);
            response.setDirections(List.of("No verified pedestrian route currently exists between " +
                fromBuilding.getName() + " and " + toBuilding.getName() + " on the campus path graph."));
            return response;
        }

        // Reconstruct path
        List<Long> buildingSequence = new ArrayList<>();
        Long curr = toBuildingId;
        while (curr != null) {
            buildingSequence.add(0, curr);
            curr = previousNodes.get(curr);
        }

        List<double[]> pathCoords = new ArrayList<>();
        List<String> instructions = new ArrayList<>();
        instructions.add("Depart from " + fromBuilding.getName());

        for (int i = 0; i < buildingSequence.size(); i++) {
            Long bId = buildingSequence.get(i);
            buildingRepository.findById(bId).ifPresent(b -> {
                pathCoords.add(new double[]{ b.getLatitude(), b.getLongitude() });
                if (bId.equals(toBuildingId)) {
                    instructions.add("Arrive at " + b.getName() + " (" + b.getCode() + ")");
                } else if (!bId.equals(fromBuildingId)) {
                    instructions.add("Pass along " + b.getName());
                }
            });
        }

        double totalDist = distances.get(toBuildingId);
        int walkMinutes = (int) Math.ceil(totalDist / 75.0); // approx 75m/min walking pace

        response.setRouteFound(true);
        response.setTotalDistanceMeters(Math.round(totalDist * 10.0) / 10.0);
        response.setEstimatedDurationMinutes(walkMinutes);
        response.setDirections(instructions);
        response.setPathCoordinates(pathCoords);

        return response;
    }

    private static class Edge {
        Long targetId;
        double weight;
        CampusPath path;
        Edge(Long targetId, double weight, CampusPath path) {
            this.targetId = targetId;
            this.weight = weight;
            this.path = path;
        }
    }

    private static class NodeDistance {
        Long buildingId;
        double dist;
        NodeDistance(Long buildingId, double dist) {
            this.buildingId = buildingId;
            this.dist = dist;
        }
    }
}
