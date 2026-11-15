package com.lostlink.controller;

import com.lostlink.dto.BelongingDTO;
import com.lostlink.dto.ItemResponse;
import com.lostlink.entity.User;
import com.lostlink.service.AuthService;
import com.lostlink.service.BelongingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/belongings")
public class BelongingController {

    private final BelongingService belongingService;
    private final AuthService authService;

    public BelongingController(BelongingService belongingService, AuthService authService) {
        this.belongingService = belongingService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<BelongingDTO> addBelonging(@Valid @RequestBody BelongingDTO dto) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(belongingService.addBelonging(dto, currentUser));
    }

    @GetMapping
    public ResponseEntity<List<BelongingDTO>> getMyBelongings() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(belongingService.getMyBelongings(currentUser.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBelonging(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        belongingService.deleteBelonging(id, currentUser.getId());
        return ResponseEntity.ok(Map.of("message", "Belonging removed from vault"));
    }

    @PostMapping("/{id}/report-lost")
    public ResponseEntity<ItemResponse> reportAsLost(
        @PathVariable Long id,
        @RequestBody Map<String, Object> body
    ) {
        User currentUser = authService.getCurrentUser();
        String location = (String) body.getOrDefault("locationName", "CGC Campus");
        Long buildingId = body.get("buildingId") != null ? Long.valueOf(body.get("buildingId").toString()) : null;
        return ResponseEntity.ok(belongingService.reportBelongingAsLost(id, location, buildingId, currentUser));
    }
}
