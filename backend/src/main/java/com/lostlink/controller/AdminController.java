package com.lostlink.controller;

import com.lostlink.dto.UserSummaryDTO;
import com.lostlink.entity.SecurityAuditLog;
import com.lostlink.entity.User;
import com.lostlink.exception.ResourceNotFoundException;
import com.lostlink.repository.SecurityAuditLogRepository;
import com.lostlink.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final SecurityAuditLogRepository auditLogRepository;

    public AdminController(UserRepository userRepository, SecurityAuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users.stream().map(UserSummaryDTO::fromEntity).toList());
    }

    @PostMapping("/users/{id}/status")
    public ResponseEntity<UserSummaryDTO> updateUserStatus(
        @PathVariable Long id,
        @RequestBody Map<String, String> body
    ) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newStatus = body.get("status");
        if (newStatus != null) {
            user.setStatus(newStatus.toUpperCase());
            userRepository.save(user);

            auditLogRepository.save(new SecurityAuditLog(
                user.getId(), "ADMIN_USER_STATUS_CHANGE", "127.0.0.1", "Status changed to " + newStatus
            ));
        }

        return ResponseEntity.ok(UserSummaryDTO.fromEntity(user));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<Page<SecurityAuditLog>> getAuditLogs(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "25") int size
    ) {
        Page<SecurityAuditLog> logs = auditLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        return ResponseEntity.ok(logs);
    }
}
