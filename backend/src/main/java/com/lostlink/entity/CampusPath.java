package com.lostlink.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "campus_paths")
public class CampusPath {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "from_building_id", nullable = false)
    private Long fromBuildingId;

    @Column(name = "to_building_id", nullable = false)
    private Long toBuildingId;

    @Column(name = "distance_meters", nullable = false)
    private Double distanceMeters;

    @Column(name = "path_type")
    private String pathType = "PAVED_WALKWAY";

    @Column(name = "waypoints_json", length = 5000)
    private String waypointsJson;

    @Column(name = "is_accessible")
    private Boolean isAccessible = true;

    public CampusPath() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getFromBuildingId() { return fromBuildingId; }
    public void setFromBuildingId(Long fromBuildingId) { this.fromBuildingId = fromBuildingId; }

    public Long getToBuildingId() { return toBuildingId; }
    public void setToBuildingId(Long toBuildingId) { this.toBuildingId = toBuildingId; }

    public Double getDistanceMeters() { return distanceMeters; }
    public void setDistanceMeters(Double distanceMeters) { this.distanceMeters = distanceMeters; }

    public String getPathType() { return pathType; }
    public void setPathType(String pathType) { this.pathType = pathType; }

    public String getWaypointsJson() { return waypointsJson; }
    public void setWaypointsJson(String waypointsJson) { this.waypointsJson = waypointsJson; }

    public Boolean getIsAccessible() { return isAccessible; }
    public void setIsAccessible(Boolean accessible) { isAccessible = accessible; }
}
