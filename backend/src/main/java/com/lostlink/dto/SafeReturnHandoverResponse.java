package com.lostlink.dto;

import com.lostlink.entity.HandoverStatus;
import com.lostlink.entity.SafeReturnHandover;

import java.time.LocalDateTime;

public class SafeReturnHandoverResponse {

    private Long id;
    private Long claimId;
    private String handoverCode;
    private String qrToken;
    private String qrCodeBase64;
    private HandoverStatus status;
    private Long lockerId;
    private String handoverLocation;
    private LocalDateTime scheduledTime;
    private LocalDateTime completedTime;
    private String digitalReceiptId;
    private String notes;
    private LocalDateTime createdAt;

    public SafeReturnHandoverResponse() {}

    public static SafeReturnHandoverResponse fromEntity(SafeReturnHandover handover) {
        if (handover == null) return null;
        SafeReturnHandoverResponse dto = new SafeReturnHandoverResponse();
        dto.setId(handover.getId());
        dto.setClaimId(handover.getClaimId());
        dto.setHandoverCode(handover.getHandoverCode());
        dto.setQrToken(handover.getQrToken());
        dto.setQrCodeBase64(handover.getQrCodeBase64());
        dto.setStatus(handover.getStatus());
        dto.setLockerId(handover.getLockerId());
        dto.setHandoverLocation(handover.getHandoverLocation());
        dto.setScheduledTime(handover.getScheduledTime());
        dto.setCompletedTime(handover.getCompletedTime());
        dto.setDigitalReceiptId(handover.getDigitalReceiptId());
        dto.setNotes(handover.getNotes());
        dto.setCreatedAt(handover.getCreatedAt());
        return dto;
    }

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
