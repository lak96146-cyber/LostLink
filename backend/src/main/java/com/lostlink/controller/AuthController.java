package com.lostlink.controller;

import com.lostlink.dto.AuthRequest;
import com.lostlink.dto.AuthResponse;
import com.lostlink.dto.RegisterRequest;
import com.lostlink.dto.UserSummaryDTO;
import com.lostlink.entity.User;
import com.lostlink.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserSummaryDTO> getCurrentUser() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(UserSummaryDTO.fromEntity(user));
    }
}
