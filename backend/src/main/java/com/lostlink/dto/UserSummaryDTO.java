package com.lostlink.dto;

import com.lostlink.entity.RoleType;
import com.lostlink.entity.User;

public class UserSummaryDTO {

    private Long id;
    private String email;
    private String fullName;
    private String studentId;
    private String department;
    private RoleType role;
    private Integer trustScore;
    private Integer goodSamaritanPoints;
    private String status;
    private String avatarUrl;

    public UserSummaryDTO() {}

    public static UserSummaryDTO fromEntity(User user) {
        if (user == null) return null;
        UserSummaryDTO dto = new UserSummaryDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setStudentId(user.getStudentId());
        dto.setDepartment(user.getDepartment());
        dto.setRole(user.getRole());
        dto.setTrustScore(user.getTrustScore());
        dto.setGoodSamaritanPoints(user.getGoodSamaritanPoints());
        dto.setStatus(user.getStatus());
        dto.setAvatarUrl(user.getAvatarUrl());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public RoleType getRole() { return role; }
    public void setRole(RoleType role) { this.role = role; }

    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }

    public Integer getGoodSamaritanPoints() { return goodSamaritanPoints; }
    public void setGoodSamaritanPoints(Integer goodSamaritanPoints) { this.goodSamaritanPoints = goodSamaritanPoints; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
