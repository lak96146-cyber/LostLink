package com.lostlink.dto;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private UserSummaryDTO user;

    public AuthResponse() {}

    public AuthResponse(String token, UserSummaryDTO user) {
        this.token = token;
        this.tokenType = "Bearer";
        this.user = user;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public UserSummaryDTO getUser() { return user; }
    public void setUser(UserSummaryDTO user) { this.user = user; }
}
