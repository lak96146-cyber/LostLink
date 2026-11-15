package com.lostlink.dto;

import java.util.List;

public class CampusRouteDTO {

    private Long fromBuildingId;
    private String fromBuildingName;
    private Long toBuildingId;
    private String toBuildingName;
    private Double totalDistanceMeters;
    private Integer estimatedDurationMinutes;
    private List<String> directions;
    private List<double[]> pathCoordinates; // [lat, lng] array
    private boolean routeFound;

    public CampusRouteDTO() {}

    public Long getFromBuildingId() { return fromBuildingId; }
    public void setFromBuildingId(Long fromBuildingId) { this.fromBuildingId = fromBuildingId; }

    public String getFromBuildingName() { return fromBuildingName; }
    public void setFromBuildingName(String fromBuildingName) { this.fromBuildingName = fromBuildingName; }

    public Long getToBuildingId() { return toBuildingId; }
    public void setToBuildingId(Long toBuildingId) { this.toBuildingId = toBuildingId; }

    public String getToBuildingName() { return toBuildingName; }
    public void setToBuildingName(String toBuildingName) { this.toBuildingName = toBuildingName; }

    public Double getTotalDistanceMeters() { return totalDistanceMeters; }
    public void setTotalDistanceMeters(Double totalDistanceMeters) { this.totalDistanceMeters = totalDistanceMeters; }

    public Integer getEstimatedDurationMinutes() { return estimatedDurationMinutes; }
    public void setEstimatedDurationMinutes(Integer estimatedDurationMinutes) { this.estimatedDurationMinutes = estimatedDurationMinutes; }

    public List<String> getDirections() { return directions; }
    public void setDirections(List<String> directions) { this.directions = directions; }

    public List<double[]> getPathCoordinates() { return pathCoordinates; }
    public void setPathCoordinates(List<double[]> pathCoordinates) { this.pathCoordinates = pathCoordinates; }

    public boolean isRouteFound() { return routeFound; }
    public void setRouteFound(boolean routeFound) { this.routeFound = routeFound; }
}
