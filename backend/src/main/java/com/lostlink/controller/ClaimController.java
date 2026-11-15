package com.lostlink.controller;

import com.lostlink.dto.ClaimRequest;
import com.lostlink.dto.ClaimResponse;
import com.lostlink.entity.User;
import com.lostlink.service.AuthService;
import com.lostlink.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;
    private final AuthService authService;

    public ClaimController(ClaimService claimService, AuthService authService) {
        this.claimService = claimService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ClaimResponse> submitClaim(@Valid @RequestBody ClaimRequest request) {
        User currentUser = authService.getCurrentUser();
        ClaimResponse response = claimService.submitClaim(request, currentUser);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-claims")
    public ResponseEntity<List<ClaimResponse>> getMyClaims() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(claimService.getMyClaims(currentUser.getId()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<ClaimResponse>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaimsForAdmin());
    }

    @PostMapping("/{id}/review")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ClaimResponse> reviewClaim(
        @PathVariable Long id,
        @RequestBody Map<String, Object> body
    ) {
        User admin = authService.getCurrentUser();
        boolean approve = Boolean.TRUE.equals(body.get("approve"));
        String notes = (String) body.getOrDefault("notes", "Reviewed by campus administrator.");
        return ResponseEntity.ok(claimService.reviewClaim(id, approve, notes, admin));
    }
}
