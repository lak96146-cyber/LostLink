package com.lostlink.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "campus_buildings")
public class CampusBuilding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String category; // ACADEMIC, ADMIN, HOSTEL, RECREATIONAL, AMENITY

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "height_meters")
    private Double heightMeters = 15.0;

    @Column(name = "width_meters")
    private Double widthMeters = 40.0;

    @Column(name = "depth_meters")
    private Double depthMeters = 30.0;

    @Column(name = "footprint_json", length = 5000)
    private String footprintJson;

    private Integer floors = 4;

    @Column(length = 1000)
    private String description;

    @Column(name = "osm_id")
    private Long osmId;

    public CampusBuilding() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getHeightMeters() { return heightMeters; }
    public void setHeightMeters(Double heightMeters) { this.heightMeters = heightMeters; }

    public Double getWidthMeters() { return widthMeters; }
    public void setWidthMeters(Double widthMeters) { this.widthMeters = widthMeters; }

    public Double getDepthMeters() { return depthMeters; }
    public void setDepthMeters(Double depthMeters) { this.depthMeters = depthMeters; }

    public String getFootprintJson() { return footprintJson; }
    public void setFootprintJson(String footprintJson) { this.footprintJson = footprintJson; }

    public Integer getFloors() { return floors; }
    public void setFloors(Integer floors) { this.floors = floors; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getOsmId() { return osmId; }
    public void setOsmId(Long osmId) { this.osmId = osmId; }
}
