package com.lostlink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class HandoverVerifyRequest {

    @NotNull(message = "Claim ID is required")
    private Long claimId;

    @NotBlank(message = "Verification code or QR token is required")
    private String verificationCodeOrToken;

    public HandoverVerifyRequest() {}

    public Long getClaimId() { return claimId; }
    public void setClaimId(Long claimId) { this.claimId = claimId; }

    public String getVerificationCodeOrToken() { return verificationCodeOrToken; }
    public void setVerificationCodeOrToken(String verificationCodeOrToken) { this.verificationCodeOrToken = verificationCodeOrToken; }
}
