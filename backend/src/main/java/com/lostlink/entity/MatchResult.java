package com.lostlink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"lost_item_id", "found_item_id"})
}, indexes = {
    @Index(name = "idx_match_lost_item", columnList = "lost_item_id"),
    @Index(name = "idx_match_found_item", columnList = "found_item_id"),
    @Index(name = "idx_match_score", columnList = "overall_score")
})
public class MatchResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lost_item_id", nullable = false)
    private Long lostItemId;

    @Column(name = "found_item_id", nullable = false)
    private Long foundItemId;

    @Column(name = "overall_score", nullable = false)
    private Double overallScore;

    @Column(name = "name_score")
    private Double nameScore;

    @Column(name = "category_score")
    private Double categoryScore;

    @Column(name = "description_score")
    private Double descriptionScore;

    @Column(name = "location_score")
    private Double locationScore;

    @Column(name = "date_score")
    private Double dateScore;

    @Column(name = "color_score")
    private Double colorScore;

    @Column(name = "brand_score")
    private Double brandScore;

    @Column(name = "distance_meters")
    private Double distanceMeters;

    @Column(name = "days_difference")
    private Long daysDifference;

    @Enumerated(EnumType.STRING)
    @Column(name = "confidence_classification", nullable = false)
    private ConfidenceLevel confidenceClassification;

    @Column(name = "match_reasons_json", length = 3000)
    private String matchReasonsJson;

    @Column(name = "matching_attributes_json", length = 2000)
    private String matchingAttributesJson;

    @Column(name = "mismatching_attributes_json", length = 2000)
    private String mismatchingAttributesJson;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public MatchResult() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getLostItemId() { return lostItemId; }
    public void setLostItemId(Long lostItemId) { this.lostItemId = lostItemId; }

    public Long getFoundItemId() { return foundItemId; }
    public void setFoundItemId(Long foundItemId) { this.foundItemId = foundItemId; }

    public Double getOverallScore() { return overallScore; }
    public void setOverallScore(Double overallScore) { this.overallScore = overallScore; }

    public Double getNameScore() { return nameScore; }
    public void setNameScore(Double nameScore) { this.nameScore = nameScore; }

    public Double getCategoryScore() { return categoryScore; }
    public void setCategoryScore(Double categoryScore) { this.categoryScore = categoryScore; }

    public Double getDescriptionScore() { return descriptionScore; }
    public void setDescriptionScore(Double descriptionScore) { this.descriptionScore = descriptionScore; }

    public Double getLocationScore() { return locationScore; }
    public void setLocationScore(Double locationScore) { this.locationScore = locationScore; }

    public Double getDateScore() { return dateScore; }
    public void setDateScore(Double dateScore) { this.dateScore = dateScore; }

    public Double getColorScore() { return colorScore; }
    public void setColorScore(Double colorScore) { this.colorScore = colorScore; }

    public Double getBrandScore() { return brandScore; }
    public void setBrandScore(Double brandScore) { this.brandScore = brandScore; }

    public Double getDistanceMeters() { return distanceMeters; }
    public void setDistanceMeters(Double distanceMeters) { this.distanceMeters = distanceMeters; }

    public Long getDaysDifference() { return daysDifference; }
    public void setDaysDifference(Long daysDifference) { this.daysDifference = daysDifference; }

    public ConfidenceLevel getConfidenceClassification() { return confidenceClassification; }
    public void setConfidenceClassification(ConfidenceLevel confidenceClassification) { this.confidenceClassification = confidenceClassification; }

    public String getMatchReasonsJson() { return matchReasonsJson; }
    public void setMatchReasonsJson(String matchReasonsJson) { this.matchReasonsJson = matchReasonsJson; }

    public String getMatchingAttributesJson() { return matchingAttributesJson; }
    public void setMatchingAttributesJson(String matchingAttributesJson) { this.matchingAttributesJson = matchingAttributesJson; }

    public String getMismatchingAttributesJson() { return mismatchingAttributesJson; }
    public void setMismatchingAttributesJson(String mismatchingAttributesJson) { this.mismatchingAttributesJson = mismatchingAttributesJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
