package com.lostlink.dto;

import com.lostlink.entity.Belonging;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class BelongingDTO {

    private Long id;

    @NotBlank(message = "Item name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    private String brand;
    private String color;
    private String serialNumber;
    private String distinctiveMarks;
    private Double estimatedValue;
    private String imageUrl;
    private LocalDateTime createdAt;

    public BelongingDTO() {}

    public static BelongingDTO fromEntity(Belonging b) {
        if (b == null) return null;
        BelongingDTO dto = new BelongingDTO();
        dto.setId(b.getId());
        dto.setName(b.getName());
        dto.setCategory(b.getCategory());
        dto.setBrand(b.getBrand());
        dto.setColor(b.getColor());
        dto.setSerialNumber(b.getSerialNumber());
        dto.setDistinctiveMarks(b.getDistinctiveMarks());
        dto.setEstimatedValue(b.getEstimatedValue());
        dto.setImageUrl(b.getImageUrl());
        dto.setCreatedAt(b.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public String getDistinctiveMarks() { return distinctiveMarks; }
    public void setDistinctiveMarks(String distinctiveMarks) { this.distinctiveMarks = distinctiveMarks; }

    public Double getEstimatedValue() { return estimatedValue; }
    public void setEstimatedValue(Double estimatedValue) { this.estimatedValue = estimatedValue; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
