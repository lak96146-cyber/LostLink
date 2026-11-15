package com.lostlink;

import com.lostlink.entity.ItemPrivateDetail;
import com.lostlink.entity.RiskLevel;
import com.lostlink.repository.ClaimRepository;
import com.lostlink.repository.ItemPrivateDetailRepository;
import com.lostlink.verification.ItemDnaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class ItemDnaServiceTest {

    private ItemPrivateDetailRepository detailRepository;
    private ClaimRepository claimRepository;
    private ItemDnaService dnaService;

    @BeforeEach
    public void setUp() {
        detailRepository = Mockito.mock(ItemPrivateDetailRepository.class);
        claimRepository = Mockito.mock(ClaimRepository.class);
        dnaService = new ItemDnaService(detailRepository, claimRepository);
    }

    @Test
    public void testHashSecretDeterministic() {
        String hash1 = ItemDnaService.hashSecret("SN-99881122");
        String hash2 = ItemDnaService.hashSecret("sn-99881122 ");
        assertEquals(hash1, hash2, "Hashing should be normalized and case-insensitive");
    }

    @Test
    public void testVerificationMatchesMatchingSerial() {
        ItemPrivateDetail detail = new ItemPrivateDetail();
        detail.setItemId(100L);
        detail.setSerialNumberHash(ItemDnaService.hashSecret("SERIAL-ABC-123"));
        detail.setDistinctiveMarks("Red dragon sticker on bottom corner");

        when(detailRepository.findByItemId(100L)).thenReturn(Optional.of(detail));
        when(claimRepository.findByFoundItemIdOrderByCreatedAtDesc(100L)).thenReturn(Collections.emptyList());

        double score = dnaService.evaluateOwnershipProof(100L, "SERIAL-ABC-123", "Red dragon sticker", null);
        assertTrue(score >= 75.0, "Score should be high for exact serial and distinctive marks: " + score);

        RiskLevel risk = dnaService.computeClaimRisk(100L, 5L, score);
        assertEquals(RiskLevel.LOW, risk);
    }

    @Test
    public void testVerificationFailsForIncorrectSerial() {
        ItemPrivateDetail detail = new ItemPrivateDetail();
        detail.setItemId(100L);
        detail.setSerialNumberHash(ItemDnaService.hashSecret("CORRECT-SERIAL"));
        detail.setDistinctiveMarks("Scratch near camera");

        when(detailRepository.findByItemId(100L)).thenReturn(Optional.of(detail));

        double score = dnaService.evaluateOwnershipProof(100L, "WRONG-SERIAL", "No marks", null);
        assertTrue(score < 40.0, "Score should be low for invalid serial: " + score);
    }
}
