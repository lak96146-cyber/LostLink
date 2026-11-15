package com.lostlink;

import com.lostlink.entity.ConfidenceLevel;
import com.lostlink.entity.Item;
import com.lostlink.entity.ItemType;
import com.lostlink.entity.MatchResult;
import com.lostlink.matching.SmartMatchEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

public class SmartMatchEngineTest {

    private SmartMatchEngine engine;

    @BeforeEach
    public void setUp() {
        engine = new SmartMatchEngine();
    }

    @Test
    public void testHighConfidenceMatchForMacBook() {
        Item lost = new Item();
        lost.setId(1L);
        lost.setTitle("Apple MacBook Air M2 13-inch (Space Grey)");
        lost.setType(ItemType.LOST);
        lost.setCategory("Electronics");
        lost.setDescription("Space Grey MacBook Air with stickers in navy felt sleeve");
        lost.setBrand("Apple");
        lost.setColor("Space Grey");
        lost.setDateLostOrFound(LocalDate.now());
        lost.setLocationName("Block 2 - Computer Science & Engineering");
        lost.setLatitude(30.68210);
        lost.setLongitude(76.60630);

        Item found = new Item();
        found.setId(2L);
        found.setTitle("Apple MacBook Air Space Grey in Sleeve");
        found.setType(ItemType.FOUND);
        found.setCategory("Electronics");
        found.setDescription("Found Space Grey Apple MacBook inside navy sleeve on desk");
        found.setBrand("Apple");
        found.setColor("Space Grey");
        found.setDateLostOrFound(LocalDate.now());
        found.setLocationName("Block 2 - Computer Science Ground Floor");
        found.setLatitude(30.68205);
        found.setLongitude(76.60625);

        MatchResult result = engine.evaluateMatch(lost, found);

        assertNotNull(result);
        assertTrue(result.getOverallScore() >= 75.0, "Expected overall score >= 75%, got: " + result.getOverallScore());
        assertEquals(ConfidenceLevel.STRONG_MATCH, result.getConfidenceClassification());
        assertTrue(result.getDistanceMeters() < 50.0);
        assertTrue(result.getNameScore() >= 15.0);
        assertEquals(20.0, result.getCategoryScore());
    }

    @Test
    public void testLowConfidenceForDissimilarItems() {
        Item lost = new Item();
        lost.setId(10L);
        lost.setTitle("Blue Water Bottle");
        lost.setType(ItemType.LOST);
        lost.setCategory("Bottles");
        lost.setDescription("Milton insulated metal water flask");
        lost.setDateLostOrFound(LocalDate.now().minusDays(20));
        lost.setLatitude(30.68114);
        lost.setLongitude(76.60584);

        Item found = new Item();
        found.setId(11L);
        found.setTitle("Casio Calculator fx-991");
        found.setType(ItemType.FOUND);
        found.setCategory("Electronics");
        found.setDescription("Scientific calculator left in room 301");
        found.setDateLostOrFound(LocalDate.now());
        found.setLatitude(30.68340);
        found.setLongitude(76.60420);

        MatchResult result = engine.evaluateMatch(lost, found);

        assertNotNull(result);
        assertTrue(result.getOverallScore() < 50.0);
        assertEquals(ConfidenceLevel.WEAK_MATCH, result.getConfidenceClassification());
    }

    @Test
    public void testHaversineDistanceAccuracy() {
        // Distance from CGC Jhanjeri center to Block 2 (approx 110-120 meters)
        double dist = engine.calculateHaversineDistance(30.68114, 76.60584, 30.68210, 76.60630);
        assertTrue(dist > 90 && dist < 140, "Calculated distance out of expected range: " + dist);
    }
}
