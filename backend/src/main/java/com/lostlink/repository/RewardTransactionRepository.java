package com.lostlink.repository;

import com.lostlink.entity.RewardTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardTransactionRepository extends JpaRepository<RewardTransaction, Long> {
    List<RewardTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT r.userId, SUM(r.points) FROM RewardTransaction r GROUP BY r.userId ORDER BY SUM(r.points) DESC")
    List<Object[]> getLeaderboardPoints();
}
