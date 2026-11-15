package com.lostlink.controller;

import com.lostlink.entity.LockerRecord;
import com.lostlink.entity.User;
import com.lostlink.service.AuthService;
import com.lostlink.service.LockerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lockers")
public class LockerController {

    private final LockerService lockerService;
    private final AuthService authService;

    public LockerController(LockerService lockerService, AuthService authService) {
        this.lockerService = lockerService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<LockerRecord>> getAllLockers() {
        return ResponseEntity.ok(lockerService.getAllLockers());
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<LockerRecord> assignLocker(
        @PathVariable Long id,
        @RequestBody Map<String, Object> body
    ) {
        User admin = authService.getCurrentUser();
        Long itemId = Long.valueOf(body.get("itemId").toString());
        String notes = (String) body.getOrDefault("notes", "Assigned by campus guardian.");
        return ResponseEntity.ok(lockerService.assignItemToLocker(id, itemId, admin.getId(), notes));
    }

    @PostMapping("/{id}/release")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<LockerRecord> releaseLocker(@PathVariable Long id) {
        return ResponseEntity.ok(lockerService.releaseLocker(id));
    }
}
