package com.lostlink.controller;

import com.lostlink.entity.RewardTransaction;
import com.lostlink.entity.User;
import com.lostlink.entity.UserAchievement;
import com.lostlink.service.AuthService;
import com.lostlink.service.RewardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rewards")
public class RewardController {

    private final RewardService rewardService;
    private final AuthService authService;

    public RewardController(RewardService rewardService, AuthService authService) {
        this.rewardService = rewardService;
        this.authService = authService;
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard() {
        return ResponseEntity.ok(rewardService.getCommunityLeaderboard());
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<RewardTransaction>> getMyHistory() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(rewardService.getUserRewardHistory(currentUser.getId()));
    }

    @GetMapping("/my-achievements")
    public ResponseEntity<List<UserAchievement>> getMyAchievements() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(rewardService.getUserAchievements(currentUser.getId()));
    }
}
