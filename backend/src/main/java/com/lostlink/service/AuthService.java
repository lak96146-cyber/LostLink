package com.lostlink.service;

import com.lostlink.dto.AuthRequest;
import com.lostlink.dto.AuthResponse;
import com.lostlink.dto.RegisterRequest;
import com.lostlink.dto.UserSummaryDTO;
import com.lostlink.entity.RoleType;
import com.lostlink.entity.SecurityAuditLog;
import com.lostlink.entity.User;
import com.lostlink.exception.BadRequestException;
import com.lostlink.exception.ResourceNotFoundException;
import com.lostlink.repository.SecurityAuditLogRepository;
import com.lostlink.repository.UserRepository;
import com.lostlink.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final SecurityAuditLogRepository auditLogRepository;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       SecurityAuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email address already exists.");
        }
        if (request.getStudentId() != null && !request.getStudentId().isBlank()) {
            if (userRepository.existsByStudentId(request.getStudentId())) {
                throw new BadRequestException("An account with this Student ID already exists.");
            }
        }

        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setStudentId(request.getStudentId() != null ? request.getStudentId().trim() : null);
        user.setDepartment(request.getDepartment());
        user.setPhone(request.getPhone());
        user.setRole(RoleType.ROLE_STUDENT);
        user.setTrustScore(100);
        user.setGoodSamaritanPoints(10); // Welcome bonus

        User savedUser = userRepository.save(user);

        auditLogRepository.save(new SecurityAuditLog(
            savedUser.getId(), "STUDENT_REGISTERED", "127.0.0.1", "Registered student: " + savedUser.getEmail()
        ));

        String token = tokenProvider.generateTokenFromUserId(savedUser.getId(), savedUser.getEmail());
        return new AuthResponse(token, UserSummaryDTO.fromEntity(savedUser));
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        auditLogRepository.save(new SecurityAuditLog(
            user.getId(), "LOGIN_SUCCESS", "127.0.0.1", "User logged in: " + user.getEmail()
        ));

        return new AuthResponse(token, UserSummaryDTO.fromEntity(user));
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new BadRequestException("No authenticated user in session");
        }
        return userRepository.findByEmail(auth.getName())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
