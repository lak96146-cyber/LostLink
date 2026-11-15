package com.lostlink.matching;

import com.lostlink.entity.ConfidenceLevel;
import com.lostlink.entity.Item;
import com.lostlink.entity.MatchResult;
import org.springframework.stereotype.Component;

import java.time.temporal.ChronoUnit;
import java.util.*;

@Component
public class SmartMatchEngine {

    // Weights conforming to Section 7 specification
    private static final double WEIGHT_NAME = 25.0;
    private static final double WEIGHT_CATEGORY = 20.0;
    private static final double WEIGHT_DESCRIPTION = 15.0;
    private static final double WEIGHT_LOCATION = 15.0;
    private static final double WEIGHT_DATE = 10.0;
    private static final double WEIGHT_COLOR = 10.0;
    private static final double WEIGHT_BRAND = 5.0;

    public MatchResult evaluateMatch(Item lostItem, Item foundItem) {
        if (lostItem == null || foundItem == null) return null;

        List<String> reasons = new ArrayList<>();
        List<String> matchingAttrs = new ArrayList<>();
        List<String> mismatchingAttrs = new ArrayList<>();

        // 1. Name Similarity (25%)
        double nameRatio = calculateStringSimilarity(lostItem.getTitle(), foundItem.getTitle());
        double nameScore = (nameRatio * WEIGHT_NAME);
        if (nameRatio >= 0.7) {
            matchingAttrs.add("Title / Item Name (" + (int)(nameRatio * 100) + "% match)");
            reasons.add("Strong title correlation: '" + lostItem.getTitle() + "' and '" + foundItem.getTitle() + "'");
        } else if (nameRatio < 0.4) {
            mismatchingAttrs.add("Title difference");
        }

        // 2. Category Match (20%)
        double categoryRatio = 0.0;
        if (lostItem.getCategory() != null && foundItem.getCategory() != null) {
            if (lostItem.getCategory().equalsIgnoreCase(foundItem.getCategory())) {
                categoryRatio = 1.0;
                matchingAttrs.add("Identical Category: " + lostItem.getCategory());
                reasons.add("Both items belong to " + lostItem.getCategory());
            } else if (isCategoryRelated(lostItem.getCategory(), foundItem.getCategory())) {
                categoryRatio = 0.5;
                matchingAttrs.add("Related Category");
            } else {
                mismatchingAttrs.add("Different Categories (" + lostItem.getCategory() + " vs " + foundItem.getCategory() + ")");
            }
        }
        double categoryScore = (categoryRatio * WEIGHT_CATEGORY);

        // 3. Description Similarity (15%)
        double descRatio = calculateTokenOverlap(lostItem.getDescription(), foundItem.getDescription());
        double descScore = (descRatio * WEIGHT_DESCRIPTION);
        if (descRatio >= 0.5) {
            matchingAttrs.add("Shared descriptive keywords");
            reasons.add("Description features significant overlap in keywords");
        }

        // 4. Location Proximity (15%)
        double locationRatio = 0.0;
        double distanceMeters = 0.0;
        if (lostItem.getLatitude() != null && lostItem.getLongitude() != null &&
            foundItem.getLatitude() != null && foundItem.getLongitude() != null) {
            distanceMeters = calculateHaversineDistance(
                lostItem.getLatitude(), lostItem.getLongitude(),
                foundItem.getLatitude(), foundItem.getLongitude()
            );

            // Campus scale: Within 50m = 100%, 150m = 80%, 300m = 60%, 600m = 30%, >1000m = 0%
            if (distanceMeters <= 50) {
                locationRatio = 1.0;
                matchingAttrs.add("Very close physical location (" + Math.round(distanceMeters) + "m apart)");
                reasons.add("Reported within " + Math.round(distanceMeters) + " meters in the same campus sector");
            } else if (distanceMeters <= 200) {
                locationRatio = 0.85;
                matchingAttrs.add("Nearby location (" + Math.round(distanceMeters) + "m apart)");
                reasons.add("Locations are adjacent on campus (" + Math.round(distanceMeters) + "m)");
            } else if (distanceMeters <= 500) {
                locationRatio = 0.60;
                reasons.add("Within walking distance (" + Math.round(distanceMeters) + "m)");
            } else if (distanceMeters <= 1000) {
                locationRatio = 0.30;
            } else {
                locationRatio = 0.05;
                mismatchingAttrs.add("Significant distance (" + Math.round(distanceMeters) + "m apart)");
            }
        } else if (lostItem.getLocationName() != null && foundItem.getLocationName() != null) {
            double locNameSim = calculateStringSimilarity(lostItem.getLocationName(), foundItem.getLocationName());
            locationRatio = locNameSim;
            if (locNameSim > 0.7) {
                matchingAttrs.add("Matching building/location name: " + lostItem.getLocationName());
                reasons.add("Reported at the same campus facility");
            }
        }
        double locationScore = (locationRatio * WEIGHT_LOCATION);

        // 5. Date Proximity (10%)
        double dateRatio = 0.5;
        long daysDiff = 0;
        if (lostItem.getDateLostOrFound() != null && foundItem.getDateLostOrFound() != null) {
            daysDiff = Math.abs(ChronoUnit.DAYS.between(lostItem.getDateLostOrFound(), foundItem.getDateLostOrFound()));
            if (daysDiff == 0) {
                dateRatio = 1.0;
                matchingAttrs.add("Exact same date");
                reasons.add("Both reported on the exact same date");
            } else if (daysDiff <= 2) {
                dateRatio = 0.9;
                matchingAttrs.add("Within 48 hours (" + daysDiff + " days difference)");
                reasons.add("Reported within 2 days of each other");
            } else if (daysDiff <= 7) {
                dateRatio = 0.7;
                reasons.add("Reported within the same week (" + daysDiff + " days difference)");
            } else if (daysDiff <= 30) {
                dateRatio = 0.4;
            } else {
                dateRatio = 0.1;
                mismatchingAttrs.add("Date gap of " + daysDiff + " days");
            }
        }
        double dateScore = (dateRatio * WEIGHT_DATE);

        // 6. Color Similarity (10%)
        double colorRatio = 0.0;
        if (lostItem.getColor() != null && foundItem.getColor() != null) {
            double colSim = calculateStringSimilarity(lostItem.getColor(), foundItem.getColor());
            colorRatio = colSim;
            if (colSim >= 0.8) {
                matchingAttrs.add("Matching Color: " + lostItem.getColor());
                reasons.add("Both identified as " + lostItem.getColor());
            } else if (colSim < 0.4) {
                mismatchingAttrs.add("Color discrepancy (" + lostItem.getColor() + " vs " + foundItem.getColor() + ")");
            }
        }
        double colorScore = (colorRatio * WEIGHT_COLOR);

        // 7. Brand Similarity (5%)
        double brandRatio = 0.0;
        if (lostItem.getBrand() != null && foundItem.getBrand() != null &&
            !lostItem.getBrand().isBlank() && !foundItem.getBrand().isBlank()) {
            double brSim = calculateStringSimilarity(lostItem.getBrand(), foundItem.getBrand());
            brandRatio = brSim;
            if (brSim >= 0.8) {
                matchingAttrs.add("Matching Brand: " + lostItem.getBrand());
                reasons.add("Brand verified: " + lostItem.getBrand());
            } else {
                mismatchingAttrs.add("Different brand indications");
            }
        } else {
            brandRatio = 0.5; // neutral if unstated
        }
        double brandScore = (brandRatio * WEIGHT_BRAND);

        double totalScore = nameScore + categoryScore + descScore + locationScore + dateScore + colorScore + brandScore;
        totalScore = Math.min(100.0, Math.max(0.0, Math.round(totalScore * 10.0) / 10.0));

        ConfidenceLevel confidence;
        if (totalScore >= 75.0) {
            confidence = ConfidenceLevel.STRONG_MATCH;
        } else if (totalScore >= 50.0) {
            confidence = ConfidenceLevel.POSSIBLE_MATCH;
        } else {
            confidence = ConfidenceLevel.WEAK_MATCH;
        }

        MatchResult result = new MatchResult();
        result.setLostItemId(lostItem.getId());
        result.setFoundItemId(foundItem.getId());
        result.setOverallScore(totalScore);
        result.setNameScore(Math.round(nameScore * 10.0) / 10.0);
        result.setCategoryScore(Math.round(categoryScore * 10.0) / 10.0);
        result.setDescriptionScore(Math.round(descScore * 10.0) / 10.0);
        result.setLocationScore(Math.round(locationScore * 10.0) / 10.0);
        result.setDateScore(Math.round(dateScore * 10.0) / 10.0);
        result.setColorScore(Math.round(colorScore * 10.0) / 10.0);
        result.setBrandScore(Math.round(brandScore * 10.0) / 10.0);
        result.setDistanceMeters(Math.round(distanceMeters * 10.0) / 10.0);
        result.setDaysDifference(daysDiff);
        result.setConfidenceClassification(confidence);
        result.setMatchReasonsJson(serializeList(reasons));
        result.setMatchingAttributesJson(serializeList(matchingAttrs));
        result.setMismatchingAttributesJson(serializeList(mismatchingAttrs));

        return result;
    }

    // Jaro-Winkler & Token-blend Metric
    public double calculateStringSimilarity(String s1, String s2) {
        if (s1 == null || s2 == null) return 0.0;
        String a = s1.trim().toLowerCase();
        String b = s2.trim().toLowerCase();
        if (a.equals(b)) return 1.0;
        if (a.isEmpty() || b.isEmpty()) return 0.0;
        if (a.contains(b) || b.contains(a)) return 0.90;

        // Token overlap blend
        double tokenSim = calculateTokenOverlap(s1, s2);

        // Levenshtein-based similarity
        int maxLen = Math.max(a.length(), b.length());
        int distance = computeLevenshteinDistance(a, b);
        double levSim = 1.0 - ((double) distance / maxLen);

        return Math.max(tokenSim, (tokenSim * 0.65 + levSim * 0.35));
    }

    private int computeLevenshteinDistance(String s1, String s2) {
        int[] prev = new int[s2.length() + 1];
        int[] curr = new int[s2.length() + 1];

        for (int j = 0; j <= s2.length(); j++) prev[j] = j;

        for (int i = 1; i <= s1.length(); i++) {
            curr[0] = i;
            for (int j = 1; j <= s2.length(); j++) {
                int cost = (s1.charAt(i - 1) == s2.charAt(j - 1)) ? 0 : 1;
                curr[j] = Math.min(Math.min(curr[j - 1] + 1, prev[j] + 1), prev[j - 1] + cost);
            }
            System.arraycopy(curr, 0, prev, 0, curr.length);
        }
        return prev[s2.length()];
    }

    // Tokenized Jaccard similarity for descriptions
    public double calculateTokenOverlap(String d1, String d2) {
        if (d1 == null || d2 == null) return 0.0;
        Set<String> set1 = tokenize(d1);
        Set<String> set2 = tokenize(d2);
        if (set1.isEmpty() || set2.isEmpty()) return 0.0;

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        return (double) intersection.size() / union.size();
    }

    private Set<String> tokenize(String text) {
        Set<String> tokens = new HashSet<>();
        String[] words = text.toLowerCase().replaceAll("[^a-z0-9\\s]", " ").split("\\s+");
        Set<String> stopWords = Set.of("the", "a", "an", "is", "in", "at", "of", "on", "and", "or", "to", "with", "for", "it", "was", "my", "lost", "found");
        for (String w : words) {
            if (w.length() > 2 && !stopWords.contains(w)) {
                tokens.add(w);
            }
        }
        return tokens;
    }

    // Haversine Distance in meters
    public double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371000.0; // Earth radius in meters
        double phi1 = Math.toRadians(lat1);
        double phi2 = Math.toRadians(lat2);
        double deltaPhi = Math.toRadians(lat2 - lat1);
        double deltaLambda = Math.toRadians(lon2 - lon1);

        double a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                   Math.cos(phi1) * Math.cos(phi2) *
                   Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    private boolean isCategoryRelated(String c1, String c2) {
        String a = c1.toLowerCase();
        String b = c2.toLowerCase();
        if (a.contains("id") && b.contains("document")) return true;
        if (a.contains("document") && b.contains("id")) return true;
        if (a.contains("wallet") && b.contains("accessory")) return true;
        if (a.contains("electronic") && b.contains("accessory")) return true;
        if (a.contains("clothing") && b.contains("accessory")) return true;
        return false;
    }

    private String serializeList(List<String> list) {
        if (list == null || list.isEmpty()) return "[]";
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            sb.append("\"").append(list.get(i).replace("\"", "\\\"")).append("\"");
            if (i < list.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }
}
