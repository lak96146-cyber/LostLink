package com.lostlink.controller;

import com.lostlink.dto.AnalyticsResponse;
import com.lostlink.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/public")
    public ResponseEntity<AnalyticsResponse> getPublicAnalytics() {
        return ResponseEntity.ok(analyticsService.getRecoveryAnalytics());
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<AnalyticsResponse> getAdminAnalytics() {
        return ResponseEntity.ok(analyticsService.getRecoveryAnalytics());
    }
}
