package com.lostlink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "handovers", indexes = {
    @Index(name = "idx_handover_claim", columnList = "claim_id"),
    @Index(name = "idx_handover_code", columnList = "handover_code"),
    @Index(name = "idx_handover_token", columnList = "qr_token")
})
public class SafeReturnHandover {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "claim_id", nullable = false)
    private Long claimId;

    @Column(name = "handover_code", nullable = false)
    private String handoverCode; // 6-digit OTP

    @Column(name = "qr_token", nullable = false, unique = true)
    private String qrToken;

    @Column(name = "qr_code_base64", length = 100000)
    private String qrCodeBase64;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HandoverStatus status = HandoverStatus.SCHEDULED;

    @Column(name = "locker_id")
    private Long lockerId;

    @Column(name = "handover_location")
    private String handoverLocation;

    @Column(name = "scheduled_time")
    private LocalDateTime scheduledTime;

    @Column(name = "completed_time")
    private LocalDateTime completedTime;

    @Column(name = "digital_receipt_id", unique = true)
    private String digitalReceiptId;

    @Column(length = 1000)
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public SafeReturnHandover() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }

    public String getHandoverCode() { return handoverCode; }
    public void setHandoverCode(String handoverCode) { this.handoverCode = handoverCode; }

    public String getQrToken() { return qrToken; }
    public void setQrToken(String qrToken) { this.qrToken = qrToken; }

    public String getQrCodeBase64() { return qrCodeBase64; }
    public void setQrCodeBase64(String qrCodeBase64) { this.qrCodeBase64 = qrCodeBase64; }

    public HandoverStatus getStatus() { return status; }
    public void setStatus(HandoverStatus status) { this.status = status; }

    public Long getLockerId() { return lockerId; }
    public void setLockerId(Long lockerId) { this.lockerId = lockerId; }

    public String getHandoverLocation() { return handoverLocation; }
    public void setHandoverLocation(String handoverLocation) { this.handoverLocation = handoverLocation; }

    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }

    public LocalDateTime getCompletedTime() { return completedTime; }
    public void setCompletedTime(LocalDateTime completedTime) { this.completedTime = completedTime; }

    public String getDigitalReceiptId() { return digitalReceiptId; }
    public void setDigitalReceiptId(String digitalReceiptId) { this.digitalReceiptId = digitalReceiptId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
