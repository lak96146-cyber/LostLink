package com.lostlink.controller;

import com.lostlink.dto.SmartMatchResponse;
import com.lostlink.entity.MatchResult;
import com.lostlink.service.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<SmartMatchResponse>> getMatchesForItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(matchService.getMatchesForItem(itemId));
    }

    @GetMapping("/high-confidence")
    public ResponseEntity<List<SmartMatchResponse>> getHighConfidenceMatches() {
        return ResponseEntity.ok(matchService.getHighConfidenceMatches());
    }

    @PostMapping("/recompute/{itemId}")
    public ResponseEntity<List<MatchResult>> recomputeMatches(@PathVariable Long itemId) {
        return ResponseEntity.ok(matchService.recomputeMatchesForItem(itemId));
    }
}
