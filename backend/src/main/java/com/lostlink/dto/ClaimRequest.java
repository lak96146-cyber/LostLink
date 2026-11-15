package com.lostlink.dto;

import jakarta.validation.constraints.NotNull;

public class ClaimRequest {

    @NotNull(message = "Found item ID is required")
    private Long foundItemId;

    private Long lostItemId;

    private String claimDescription;

    private String serialNumberAttempt;

    private String distinctiveMarksAttempt;

    private String claimantProofImage;

    // Optional answers to verification questions if prompted
    private String verificationAnswersJson;

    public ClaimRequest() {}

    public Long getFoundItemId() { return foundItemId; }
    public void setFoundItemId(Long foundItemId) { this.foundItemId = foundItemId; }

    public Long getLostItemId() { return lostItemId; }
    public void setLostItemId(Long lostItemId) { this.lostItemId = lostItemId; }

    public String getClaimDescription() { return claimDescription; }
    public void setClaimDescription(String claimDescription) { this.claimDescription = claimDescription; }

    public String getSerialNumberAttempt() { return serialNumberAttempt; }
    public void setSerialNumberAttempt(String serialNumberAttempt) { this.serialNumberAttempt = serialNumberAttempt; }

    public String getDistinctiveMarksAttempt() { return distinctiveMarksAttempt; }
    public void setDistinctiveMarksAttempt(String distinctiveMarksAttempt) { this.distinctiveMarksAttempt = distinctiveMarksAttempt; }

    public String getClaimantProofImage() { return claimantProofImage; }
    public void setClaimantProofImage(String claimantProofImage) { this.claimantProofImage = claimantProofImage; }

    public String getVerificationAnswersJson() { return verificationAnswersJson; }
    public void setVerificationAnswersJson(String verificationAnswersJson) { this.verificationAnswersJson = verificationAnswersJson; }
}
