package com.lostlink.service;

import com.lostlink.entity.RewardTransaction;
import com.lostlink.entity.User;
import com.lostlink.entity.UserAchievement;
import com.lostlink.repository.RewardTransactionRepository;
import com.lostlink.repository.UserAchievementRepository;
import com.lostlink.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class RewardService {

    private final RewardTransactionRepository rewardRepository;
    private final UserAchievementRepository achievementRepository;
    private final UserRepository userRepository;

    public RewardService(RewardTransactionRepository rewardRepository,
                         UserAchievementRepository achievementRepository,
                         UserRepository userRepository) {
        this.rewardRepository = rewardRepository;
        this.achievementRepository = achievementRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void addPoints(Long userId, int points, String reason, Long referenceId) {
        RewardTransaction tx = new RewardTransaction(userId, points, reason, referenceId);
        rewardRepository.save(tx);

        userRepository.findById(userId).ifPresent(user -> {
            user.setGoodSamaritanPoints(user.getGoodSamaritanPoints() + points);
            // Increment trust score slightly on good deeds
            user.setTrustScore(Math.min(100, user.getTrustScore() + (points / 10)));
            userRepository.save(user);
        });
    }

    @Transactional
    public void checkAndAwardAchievement(Long userId, String code, String title, String desc, String icon) {
        if (achievementRepository.findByUserIdAndBadgeCode(userId, code).isEmpty()) {
            UserAchievement ach = new UserAchievement(userId, code, title, desc, icon);
            achievementRepository.save(ach);
        }
    }

    @Transactional(readOnly = true)
    public List<UserAchievement> getUserAchievements(Long userId) {
        return achievementRepository.findByUserIdOrderByEarnedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<RewardTransaction> getUserRewardHistory(Long userId) {
        return rewardRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getCommunityLeaderboard() {
        List<Object[]> raw = rewardRepository.getLeaderboardPoints();
        List<Map<String, Object>> leaderboard = new ArrayList<>();

        int rank = 1;
        for (Object[] row : raw) {
            Long userId = (Long) row[0];
            Number points = (Number) row[1];

            Optional<User> optUser = userRepository.findById(userId);
            if (optUser.isPresent()) {
                User u = optUser.get();
                Map<String, Object> entry = new HashMap<>();
                entry.put("rank", rank++);
                entry.put("userId", u.getId());
                entry.put("fullName", u.getFullName());
                entry.put("department", u.getDepartment());
                entry.put("points", points.intValue());
                entry.put("trustScore", u.getTrustScore());
                entry.put("avatarUrl", u.getAvatarUrl());
                leaderboard.add(entry);
            }
            if (rank > 20) break; // Top 20
        }

        return leaderboard;
    }
}
