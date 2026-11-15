package com.lostlink.dto;

import com.lostlink.entity.ConfidenceLevel;
import com.lostlink.entity.MatchResult;

import java.time.LocalDateTime;
import java.util.List;

public class SmartMatchResponse {

    private Long id;
    private Long lostItemId;
    private Long foundItemId;
    private ItemResponse lostItem;
    private ItemResponse foundItem;
    private Double overallScore;
    private Double nameScore;
    private Double categoryScore;
    private Double descriptionScore;
    private Double locationScore;
    private Double dateScore;
    private Double colorScore;
    private Double brandScore;
    private Double distanceMeters;
    private Long daysDifference;
    private ConfidenceLevel confidenceClassification;
    private List<String> matchReasons;
    private List<String> matchingAttributes;
    private List<String> mismatchingAttributes;
    private LocalDateTime createdAt;

    public SmartMatchResponse() {}

    public static SmartMatchResponse fromEntity(MatchResult result, ItemResponse lostItem, ItemResponse foundItem,
                                                List<String> reasons, List<String> matchAttrs, List<String> mismatchAttrs) {
        if (result == null) return null;
        SmartMatchResponse dto = new SmartMatchResponse();
        dto.setId(result.getId());
        dto.setLostItemId(result.getLostItemId());
        dto.setFoundItemId(result.getFoundItemId());
        dto.setLostItem(lostItem);
        dto.setFoundItem(foundItem);
        dto.setOverallScore(result.getOverallScore());
        dto.setNameScore(result.getNameScore());
        dto.setCategoryScore(result.getCategoryScore());
        dto.setDescriptionScore(result.getDescriptionScore());
        dto.setLocationScore(result.getLocationScore());
        dto.setDateScore(result.getDateScore());
        dto.setColorScore(result.getColorScore());
        dto.setBrandScore(result.getBrandScore());
        dto.setDistanceMeters(result.getDistanceMeters());
        dto.setDaysDifference(result.getDaysDifference());
        dto.setConfidenceClassification(result.getConfidenceClassification());
        dto.setMatchReasons(reasons);
        dto.setMatchingAttributes(matchAttrs);
        dto.setMismatchingAttributes(mismatchAttrs);
        dto.setCreatedAt(result.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getLostItemId() { return lostItemId; }
    public void setLostItemId(Long lostItemId) { this.lostItemId = lostItemId; }

    public Long getFoundItemId() { return foundItemId; }
    public void setFoundItemId(Long foundItemId) { this.foundItemId = foundItemId; }

    public ItemResponse getLostItem() { return lostItem; }
    public void setLostItem(ItemResponse lostItem) { this.lostItem = lostItem; }

    public ItemResponse getFoundItem() { return foundItem; }
    public void setFoundItem(ItemResponse foundItem) { this.foundItem = foundItem; }

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

    public List<String> getMatchReasons() { return matchReasons; }
    public void setMatchReasons(List<String> matchReasons) { this.matchReasons = matchReasons; }

    public List<String> getMatchingAttributes() { return matchingAttributes; }
    public void setMatchingAttributes(List<String> matchingAttributes) { this.matchingAttributes = matchingAttributes; }

    public List<String> getMismatchingAttributes() { return mismatchingAttributes; }
    public void setMismatchingAttributes(List<String> mismatchingAttributes) { this.mismatchingAttributes = mismatchingAttributes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
