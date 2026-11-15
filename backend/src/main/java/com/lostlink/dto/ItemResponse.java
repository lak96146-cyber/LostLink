package com.lostlink.dto;

import com.lostlink.entity.Item;
import com.lostlink.entity.ItemStatus;
import com.lostlink.entity.ItemType;
import com.lostlink.entity.UrgencyLevel;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ItemResponse {

    private Long id;
    private ItemType type;
    private String title;
    private String category;
    private String description;
    private String brand;
    private String color;
    private LocalDate dateLostOrFound;
    private String locationName;
    private Long buildingId;
    private String campusZone;
    private Double latitude;
    private Double longitude;
    private UrgencyLevel urgency;
    private ItemStatus status;
    private Boolean isCritical;
    private String imageUrl;
    private UserSummaryDTO reporter;
    private Boolean hasPrivateDna;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ItemResponse() {}

    public static ItemResponse fromEntity(Item item, boolean hasPrivateDna) {
        if (item == null) return null;
        ItemResponse dto = new ItemResponse();
        dto.setId(item.getId());
        dto.setType(item.getType());
        dto.setTitle(item.getTitle());
        dto.setCategory(item.getCategory());
        dto.setDescription(item.getDescription());
        dto.setBrand(item.getBrand());
        dto.setColor(item.getColor());
        dto.setDateLostOrFound(item.getDateLostOrFound());
        dto.setLocationName(item.getLocationName());
        dto.setBuildingId(item.getBuildingId());
        dto.setCampusZone(item.getCampusZone());
        dto.setLatitude(item.getLatitude());
        dto.setLongitude(item.getLongitude());
        dto.setUrgency(item.getUrgency());
        dto.setStatus(item.getStatus());
        dto.setIsCritical(item.getIsCritical());
        dto.setImageUrl(item.getImageUrl());
        dto.setReporter(UserSummaryDTO.fromEntity(item.getReporter()));
        dto.setHasPrivateDna(hasPrivateDna);
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ItemType getType() { return type; }
    public void setType(ItemType type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public LocalDate getDateLostOrFound() { return dateLostOrFound; }
    public void setDateLostOrFound(LocalDate dateLostOrFound) { this.dateLostOrFound = dateLostOrFound; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public Long getBuildingId() { return buildingId; }
    public void setBuildingId(Long buildingId) { this.buildingId = buildingId; }

    public String getCampusZone() { return campusZone; }
    public void setCampusZone(String campusZone) { this.campusZone = campusZone; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public UrgencyLevel getUrgency() { return urgency; }
    public void setUrgency(UrgencyLevel urgency) { this.urgency = urgency; }

    public ItemStatus getStatus() { return status; }
    public void setStatus(ItemStatus status) { this.status = status; }

    public Boolean getIsCritical() { return isCritical; }
    public void setIsCritical(Boolean isCritical) { this.isCritical = isCritical; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public UserSummaryDTO getReporter() { return reporter; }
    public void setReporter(UserSummaryDTO reporter) { this.reporter = reporter; }

    public Boolean getHasPrivateDna() { return hasPrivateDna; }
    public void setHasPrivateDna(Boolean hasPrivateDna) { this.hasPrivateDna = hasPrivateDna; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
