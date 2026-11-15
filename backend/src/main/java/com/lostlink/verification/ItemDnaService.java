package com.lostlink.verification;

import com.lostlink.entity.Claim;
import com.lostlink.entity.ItemPrivateDetail;
import com.lostlink.entity.RiskLevel;
import com.lostlink.repository.ClaimRepository;
import com.lostlink.repository.ItemPrivateDetailRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.Optional;

@Service
public class ItemDnaService {

    private final ItemPrivateDetailRepository privateDetailRepository;
    private final ClaimRepository claimRepository;

    public ItemDnaService(ItemPrivateDetailRepository privateDetailRepository, ClaimRepository claimRepository) {
        this.privateDetailRepository = privateDetailRepository;
        this.claimRepository = claimRepository;
    }

    public static String hashSecret(String secret) {
        if (secret == null || secret.isBlank()) return null;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(secret.trim().toLowerCase().getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    public double evaluateOwnershipProof(Long foundItemId, String claimantSerial, String claimantDistinctiveMarks, String answersJson) {
        Optional<ItemPrivateDetail> optDetail = privateDetailRepository.findByItemId(foundItemId);
        if (optDetail.isEmpty()) {
            // No private DNA registered on the found item; score purely on descriptive testimony
            double score = 40.0;
            if (claimantDistinctiveMarks != null && claimantDistinctiveMarks.length() > 15) {
                score += 30.0;
            }
            return score;
        }

        ItemPrivateDetail detail = optDetail.get();
        double totalScore = 0.0;
        int checksCount = 0;

        // Check serial number if registered
        if (detail.getSerialNumberHash() != null) {
            checksCount++;
            if (claimantSerial != null && !claimantSerial.isBlank()) {
                String hashedAttempt = hashSecret(claimantSerial);
                if (detail.getSerialNumberHash().equalsIgnoreCase(hashedAttempt)) {
                    totalScore += 50.0;
                } else if (isFuzzySerialMatch(claimantSerial, detail.getSerialNumberHint())) {
                    totalScore += 25.0;
                }
            }
        }

        // Check distinctive marks
        if (detail.getDistinctiveMarks() != null && !detail.getDistinctiveMarks().isBlank()) {
            checksCount++;
            if (claimantDistinctiveMarks != null && !claimantDistinctiveMarks.isBlank()) {
                double textOverlap = computeOverlap(detail.getDistinctiveMarks(), claimantDistinctiveMarks);
                totalScore += (textOverlap * 50.0);
            }
        }

        if (checksCount == 0) {
            return 60.0; // Standard base evaluation
        }

        return Math.min(100.0, Math.max(0.0, Math.round(totalScore * 10.0) / 10.0));
    }

    public RiskLevel computeClaimRisk(Long foundItemId, Long claimantId, double verificationScore) {
        // Conflicting claims detection
        List<Claim> existingClaims = claimRepository.findByFoundItemIdOrderByCreatedAtDesc(foundItemId);
        long conflictingCount = existingClaims.stream()
            .filter(c -> !c.getClaimant().getId().equals(claimantId))
            .count();

        if (conflictingCount >= 2 || verificationScore < 35.0) {
            return RiskLevel.HIGH;
        } else if (conflictingCount == 1 || verificationScore < 65.0) {
            return RiskLevel.MEDIUM;
        } else {
            return RiskLevel.LOW;
        }
    }

    private boolean isFuzzySerialMatch(String attempt, String hint) {
        if (attempt == null || hint == null) return false;
        String cleanAttempt = attempt.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        String cleanHint = hint.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        return cleanAttempt.contains(cleanHint) || cleanHint.contains(cleanAttempt);
    }

    private double computeOverlap(String registered, String attempt) {
        String[] wordsReg = registered.toLowerCase().split("\\s+");
        String lowerAttempt = attempt.toLowerCase();
        int matches = 0;
        int considered = 0;
        for (String w : wordsReg) {
            if (w.length() > 3) {
                considered++;
                if (lowerAttempt.contains(w)) {
                    matches++;
                }
            }
        }
        return considered == 0 ? 0.5 : (double) matches / considered;
    }
}
