package com.lostlink.dto;

import com.lostlink.entity.ItemType;
import com.lostlink.entity.UrgencyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class ItemRequest {

    @NotBlank(message = "Item title is required")
    private String title;

    @NotNull(message = "Item type (LOST/FOUND) is required")
    private ItemType type;

    @NotBlank(message = "Category is required")
    private String category;

    private String description;
    private String brand;
    private String color;
    private LocalDate dateLostOrFound;

    @NotBlank(message = "Location name is required")
    private String locationName;

    private Long buildingId;
    private String campusZone;
    private Double latitude;
    private Double longitude;
    private UrgencyLevel urgency = UrgencyLevel.MEDIUM;
    private Boolean isCritical = false;
    private String imageUrl;

    // Item DNA Private details (only supplied by owner on creation)
    private String secretIdentifier;
    private String distinctiveMarks;
    private String serialNumber;
    private String secretNotes;
    private String privatePhotoUrl;
    private String verificationQuestionsJson;

    public ItemRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public ItemType getType() { return type; }
    public void setType(ItemType type) { this.type = type; }

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

    public Boolean getIsCritical() { return isCritical; }
    public void setIsCritical(Boolean isCritical) { this.isCritical = isCritical; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getSecretIdentifier() { return secretIdentifier; }
    public void setSecretIdentifier(String secretIdentifier) { this.secretIdentifier = secretIdentifier; }

    public String getDistinctiveMarks() { return distinctiveMarks; }
    public void setDistinctiveMarks(String distinctiveMarks) { this.distinctiveMarks = distinctiveMarks; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getSecretNotes() { return secretNotes; }
    public void setSecretNotes(String secretNotes) { this.secretNotes = secretNotes; }

    public String getPrivatePhotoUrl() { return privatePhotoUrl; }
    public void setPrivatePhotoUrl(String privatePhotoUrl) { this.privatePhotoUrl = privatePhotoUrl; }

    public String getVerificationQuestionsJson() { return verificationQuestionsJson; }
    public void setVerificationQuestionsJson(String verificationQuestionsJson) { this.verificationQuestionsJson = verificationQuestionsJson; }
}
