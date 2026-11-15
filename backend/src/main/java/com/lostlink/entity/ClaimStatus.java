package com.lostlink.entity;

public enum ClaimStatus {
    PENDING_VERIFICATION,
    VERIFICATION_FAILED,
    UNDER_ADMIN_REVIEW,
    APPROVED,
    REJECTED,
    HANDOVER_SCHEDULED,
    COMPLETED,
    CANCELLED
}
