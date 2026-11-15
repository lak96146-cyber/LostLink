package com.lostlink.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lostlink.dto.ItemResponse;
import com.lostlink.dto.SmartMatchResponse;
import com.lostlink.entity.*;
import com.lostlink.exception.ResourceNotFoundException;
import com.lostlink.matching.SmartMatchEngine;
import com.lostlink.repository.ItemPrivateDetailRepository;
import com.lostlink.repository.ItemRepository;
import com.lostlink.repository.MatchResultRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class MatchService {

    private final MatchResultRepository matchResultRepository;
    private final ItemRepository itemRepository;
    private final ItemPrivateDetailRepository privateDetailRepository;
    private final SmartMatchEngine matchEngine;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MatchService(MatchResultRepository matchResultRepository,
                        ItemRepository itemRepository,
                        ItemPrivateDetailRepository privateDetailRepository,
                        SmartMatchEngine matchEngine,
                        NotificationService notificationService) {
        this.matchResultRepository = matchResultRepository;
        this.itemRepository = itemRepository;
        this.privateDetailRepository = privateDetailRepository;
        this.matchEngine = matchEngine;
        this.notificationService = notificationService;
    }

    @Transactional
    public List<MatchResult> recomputeMatchesForItem(Long itemId) {
        Item target = itemRepository.findById(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        List<MatchResult> computedMatches = new ArrayList<>();

        if (target.getType() == ItemType.LOST) {
            List<Item> foundItems = itemRepository.findByTypeAndStatusNot(ItemType.FOUND, ItemStatus.RECOVERED);
            for (Item found : foundItems) {
                MatchResult result = matchEngine.evaluateMatch(target, found);
                if (result != null && result.getOverallScore() >= 30.0) {
                    saveOrUpdateMatch(result);
                    computedMatches.add(result);
                    if (result.getOverallScore() >= 55.0) {
                        notifyUsersOfMatch(target, found, result);
                    }
                }
            }
        } else {
            List<Item> lostItems = itemRepository.findByTypeAndStatusNot(ItemType.LOST, ItemStatus.RECOVERED);
            for (Item lost : lostItems) {
                MatchResult result = matchEngine.evaluateMatch(lost, target);
                if (result != null && result.getOverallScore() >= 30.0) {
                    saveOrUpdateMatch(result);
                    computedMatches.add(result);
                    if (result.getOverallScore() >= 55.0) {
                        notifyUsersOfMatch(lost, target, result);
                    }
                }
            }
        }

        return computedMatches;
    }

    private void saveOrUpdateMatch(MatchResult newResult) {
        Optional<MatchResult> existing = matchResultRepository.findByLostItemIdAndFoundItemId(
            newResult.getLostItemId(), newResult.getFoundItemId()
        );

        if (existing.isPresent()) {
            MatchResult m = existing.get();
            m.setOverallScore(newResult.getOverallScore());
            m.setNameScore(newResult.getNameScore());
            m.setCategoryScore(newResult.getCategoryScore());
            m.setDescriptionScore(newResult.getDescriptionScore());
            m.setLocationScore(newResult.getLocationScore());
            m.setDateScore(newResult.getDateScore());
            m.setColorScore(newResult.getColorScore());
            m.setBrandScore(newResult.getBrandScore());
            m.setDistanceMeters(newResult.getDistanceMeters());
            m.setDaysDifference(newResult.getDaysDifference());
            m.setConfidenceClassification(newResult.getConfidenceClassification());
            m.setMatchReasonsJson(newResult.getMatchReasonsJson());
            m.setMatchingAttributesJson(newResult.getMatchingAttributesJson());
            m.setMismatchingAttributesJson(newResult.getMismatchingAttributesJson());
            matchResultRepository.save(m);
        } else {
            matchResultRepository.save(newResult);
        }
    }

    private void notifyUsersOfMatch(Item lost, Item found, MatchResult result) {
        String msg = "SmartMatch (" + Math.round(result.getOverallScore()) + "% match) detected for your lost item '" +
                     lost.getTitle() + "' with found item '" + found.getTitle() + "' at " + found.getLocationName();
        notificationService.createNotification(
            lost.getReporter().getId(),
            "SmartMatch Alert: " + lost.getTitle(),
            msg,
            NotificationType.MATCH_FOUND,
            "/smartmatch?item=" + lost.getId()
        );
    }

    @Transactional(readOnly = true)
    public List<SmartMatchResponse> getMatchesForItem(Long itemId) {
        List<MatchResult> matches = matchResultRepository.findAllMatchesForItem(itemId);
        return matches.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<SmartMatchResponse> getHighConfidenceMatches() {
        List<MatchResult> matches = matchResultRepository.findHighConfidenceMatches(45.0);
        return matches.stream().map(this::toResponse).toList();
    }

    private SmartMatchResponse toResponse(MatchResult m) {
        Item lost = itemRepository.findById(m.getLostItemId()).orElse(null);
        Item found = itemRepository.findById(m.getFoundItemId()).orElse(null);

        boolean lostDna = lost != null && privateDetailRepository.findByItemId(lost.getId()).isPresent();
        boolean foundDna = found != null && privateDetailRepository.findByItemId(found.getId()).isPresent();

        List<String> reasons = parseList(m.getMatchReasonsJson());
        List<String> matching = parseList(m.getMatchingAttributesJson());
        List<String> mismatching = parseList(m.getMismatchingAttributesJson());

        return SmartMatchResponse.fromEntity(
            m,
            ItemResponse.fromEntity(lost, lostDna),
            ItemResponse.fromEntity(found, foundDna),
            reasons, matching, mismatching
        );
    }

    private List<String> parseList(String json) {
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
