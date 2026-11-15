package com.lostlink.controller;

import com.lostlink.dto.HandoverVerifyRequest;
import com.lostlink.dto.SafeReturnHandoverResponse;
import com.lostlink.entity.SafeReturnHandover;
import com.lostlink.entity.User;
import com.lostlink.repository.SafeReturnHandoverRepository;
import com.lostlink.service.AuthService;
import com.lostlink.service.SafeReturnService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/safe-return")
public class SafeReturnController {

    private final SafeReturnService safeReturnService;
    private final SafeReturnHandoverRepository handoverRepository;
    private final AuthService authService;

    public SafeReturnController(SafeReturnService safeReturnService,
                                SafeReturnHandoverRepository handoverRepository,
                                AuthService authService) {
        this.safeReturnService = safeReturnService;
        this.handoverRepository = handoverRepository;
        this.authService = authService;
    }

    @PostMapping("/verify")
    public ResponseEntity<SafeReturnHandoverResponse> verifyHandover(@Valid @RequestBody HandoverVerifyRequest request) {
        User currentUser = authService.getCurrentUser();
        SafeReturnHandoverResponse result = safeReturnService.verifyAndCompleteHandover(
            request.getClaimId(), request.getVerificationCodeOrToken(), currentUser
        );
        return ResponseEntity.ok(result);
    }

    @GetMapping("/claim/{claimId}")
    public ResponseEntity<SafeReturnHandoverResponse> getHandoverByClaim(@PathVariable Long claimId) {
        Optional<SafeReturnHandover> opt = handoverRepository.findByClaimId(claimId);
        return opt.map(h -> ResponseEntity.ok(SafeReturnHandoverResponse.fromEntity(h)))
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
