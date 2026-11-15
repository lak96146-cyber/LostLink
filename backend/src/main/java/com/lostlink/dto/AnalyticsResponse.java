package com.lostlink.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsResponse {

    private long totalUsers;
    private long totalReports;
    private long lostReports;
    private long foundReports;
    private long recoveredItems;
    private long pendingClaims;
    private long approvedClaims;
    private long rejectedClaims;
    private double recoveryRatePercentage;
    private double averageRecoveryHours;
    private long activeSmartMatches;
    private long totalBelongingsSecured;

    private Map<String, Long> categoryDistribution;
    private Map<String, Long> buildingDistribution;
    private List<LocationHotspot> hotspots;
    private List<RecentActivity> recentActivities;

    public AnalyticsResponse() {}

    public static class LocationHotspot {
        private String locationName;
        private Double latitude;
        private Double longitude;
        private long reportCount;
        private String intensity; // HIGH, MEDIUM, LOW

        public LocationHotspot() {}
        public LocationHotspot(String locationName, Double latitude, Double longitude, long reportCount, String intensity) {
            this.locationName = locationName;
            this.latitude = latitude;
            this.longitude = longitude;
            this.reportCount = reportCount;
            this.intensity = intensity;
        }

        public String getLocationName() { return locationName; }
        public void setLocationName(String locationName) { this.locationName = locationName; }
        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }
        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }
        public long getReportCount() { return reportCount; }
        public void setReportCount(long reportCount) { this.reportCount = reportCount; }
        public String getIntensity() { return intensity; }
        public void setIntensity(String intensity) { this.intensity = intensity; }
    }

    public static class RecentActivity {
        private String type;
        private String title;
        private String timestamp;
        private String user;

        public RecentActivity() {}
        public RecentActivity(String type, String title, String timestamp, String user) {
            this.type = type;
            this.title = title;
            this.timestamp = timestamp;
            this.user = user;
        }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
        public String getUser() { return user; }
        public void setUser(String user) { this.user = user; }
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalReports() { return totalReports; }
    public void setTotalReports(long totalReports) { this.totalReports = totalReports; }

    public long getLostReports() { return lostReports; }
    public void setLostReports(long lostReports) { this.lostReports = lostReports; }

    public long getFoundReports() { return foundReports; }
    public void setFoundReports(long foundReports) { this.foundReports = foundReports; }

    public long getRecoveredItems() { return recoveredItems; }
    public void setRecoveredItems(long recoveredItems) { this.recoveredItems = recoveredItems; }

    public long getPendingClaims() { return pendingClaims; }
    public void setPendingClaims(long pendingClaims) { this.pendingClaims = pendingClaims; }

    public long getApprovedClaims() { return approvedClaims; }
    public void setApprovedClaims(long approvedClaims) { this.approvedClaims = approvedClaims; }

    public long getRejectedClaims() { return rejectedClaims; }
    public void setRejectedClaims(long rejectedClaims) { this.rejectedClaims = rejectedClaims; }

    public double getRecoveryRatePercentage() { return recoveryRatePercentage; }
    public void setRecoveryRatePercentage(double recoveryRatePercentage) { this.recoveryRatePercentage = recoveryRatePercentage; }

    public double getAverageRecoveryHours() { return averageRecoveryHours; }
    public void setAverageRecoveryHours(double averageRecoveryHours) { this.averageRecoveryHours = averageRecoveryHours; }

    public long getActiveSmartMatches() { return activeSmartMatches; }
    public void setActiveSmartMatches(long activeSmartMatches) { this.activeSmartMatches = activeSmartMatches; }

    public long getTotalBelongingsSecured() { return totalBelongingsSecured; }
    public void setTotalBelongingsSecured(long totalBelongingsSecured) { this.totalBelongingsSecured = totalBelongingsSecured; }

    public Map<String, Long> getCategoryDistribution() { return categoryDistribution; }
    public void setCategoryDistribution(Map<String, Long> categoryDistribution) { this.categoryDistribution = categoryDistribution; }

    public Map<String, Long> getBuildingDistribution() { return buildingDistribution; }
    public void setBuildingDistribution(Map<String, Long> buildingDistribution) { this.buildingDistribution = buildingDistribution; }

    public List<LocationHotspot> getHotspots() { return hotspots; }
    public void setHotspots(List<LocationHotspot> hotspots) { this.hotspots = hotspots; }

    public List<RecentActivity> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<RecentActivity> recentActivities) { this.recentActivities = recentActivities; }
}
