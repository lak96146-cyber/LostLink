package com.lostlink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims", indexes = {
    @Index(name = "idx_claim_found_item", columnList = "found_item_id"),
    @Index(name = "idx_claim_claimant", columnList = "claimant_id"),
    @Index(name = "idx_claim_status", columnList = "status")
})
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lost_item_id")
    private Long lostItemId;

    @Column(name = "found_item_id", nullable = false)
    private Long foundItemId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "claimant_id", nullable = false)
    private User claimant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status = ClaimStatus.PENDING_VERIFICATION;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false)
    private RiskLevel riskLevel = RiskLevel.LOW;

    @Column(name = "verification_score")
    private Double verificationScore = 0.0;

    @Column(name = "claim_description", length = 2000)
    private String claimDescription;

    @Column(name = "serial_number_attempt")
    private String serialNumberAttempt;

    @Column(name = "distinctive_marks_attempt", length = 2000)
    private String distinctiveMarksAttempt;

    @Column(name = "claimant_proof_image", length = 500000)
    private String claimantProofImage;

    @Column(name = "admin_notes", length = 1000)
    private String adminNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_id")
    private User reviewedBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Claim() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getLostItemId() { return lostItemId; }
    public void setLostItemId(Long lostItemId) { this.lostItemId = lostItemId; }

    public Long getFoundItemId() { return foundItemId; }
    public void setFoundItemId(Long foundItemId) { this.foundItemId = foundItemId; }

    public User getClaimant() { return claimant; }
    public void setClaimant(User claimant) { this.claimant = claimant; }

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

    public User getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(User reviewedBy) { this.reviewedBy = reviewedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
