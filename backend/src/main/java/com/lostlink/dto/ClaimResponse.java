package com.lostlink.dto;

import com.lostlink.entity.Claim;
import com.lostlink.entity.ClaimStatus;
import com.lostlink.entity.RiskLevel;

import java.time.LocalDateTime;

public class ClaimResponse {

    private Long id;
    private Long lostItemId;
    private Long foundItemId;
    private ItemResponse foundItem;
    private UserSummaryDTO claimant;
    private ClaimStatus status;
    private RiskLevel riskLevel;
    private Double verificationScore;
    private String claimDescription;
    private String serialNumberAttempt;
    private String distinctiveMarksAttempt;
    private String claimantProofImage;
    private String adminNotes;
    private SafeReturnHandoverResponse handover;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ClaimResponse() {}

    public static ClaimResponse fromEntity(Claim claim, ItemResponse foundItem, SafeReturnHandoverResponse handover) {
        if (claim == null) return null;
        ClaimResponse dto = new ClaimResponse();
        dto.setId(claim.getId());
        dto.setLostItemId(claim.getLostItemId());
        dto.setFoundItemId(claim.getFoundItemId());
        dto.setFoundItem(foundItem);
        dto.setClaimant(UserSummaryDTO.fromEntity(claim.getClaimant()));
        dto.setStatus(claim.getStatus());
        dto.setRiskLevel(claim.getRiskLevel());
        dto.setVerificationScore(claim.getVerificationScore());
        dto.setClaimDescription(claim.getClaimDescription());
        dto.setSerialNumberAttempt(claim.getSerialNumberAttempt());
        dto.setDistinctiveMarksAttempt(claim.getDistinctiveMarksAttempt());
        dto.setClaimantProofImage(claim.getClaimantProofImage());
        dto.setAdminNotes(claim.getAdminNotes());
        dto.setHandover(handover);
        dto.setCreatedAt(claim.getCreatedAt());
        dto.setUpdatedAt(claim.getUpdatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getLostItemId() { return lostItemId; }
    public void setLostItemId(Long lostItemId) { this.lostItemId = lostItemId; }

    public Long getFoundItemId() { return foundItemId; }
    public void setFoundItemId(Long foundItemId) { this.foundItemId = foundItemId; }

    public ItemResponse getFoundItem() { return foundItem; }
    public void setFoundItem(ItemResponse foundItem) { this.foundItem = foundItem; }

    public UserSummaryDTO getClaimant() { return claimant; }
    public void setClaimant(UserSummaryDTO claimant) { this.claimant = claimant; }

    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }

    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }

    public Double getVerificationScore() { return verificationScore; }
    public void setVerificationScore(Double verificationScore) { this.verificationScore = verificationScore; }

    public String getClaimDescription() { return claimDescription; }
    public void setClaimDescription(String claimDescription) { this.claimDescription = claimDescription; }

    public String getSerialNumberAttempt() { return serialNumberAttempt; }
    public void setSerialNumberAttempt(String serialNumberAttempt) { this.serialNumberAttempt = serialNumberAttempt; }

    public String getDistinctiveMarksAttempt() { return distinctiveMarksAttempt; }
    public void setDistinctiveMarksAttempt(String distinctiveMarksAttempt) { this.distinctiveMarksAttempt = distinctiveMarksAttempt; }

    public String getClaimantProofImage() { return claimantProofImage; }
    public void setClaimantProofImage(String claimantProofImage) { this.claimantProofImage = claimantProofImage; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public SafeReturnHandoverResponse getHandover() { return handover; }
    public void setHandover(SafeReturnHandoverResponse handover) { this.handover = handover; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
