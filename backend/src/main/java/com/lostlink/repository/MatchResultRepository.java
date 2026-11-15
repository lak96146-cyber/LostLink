package com.lostlink.repository;

import com.lostlink.entity.MatchResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchResultRepository extends JpaRepository<MatchResult, Long> {

    Optional<MatchResult> findByLostItemIdAndFoundItemId(Long lostItemId, Long foundItemId);

    List<MatchResult> findByLostItemIdOrderByOverallScoreDesc(Long lostItemId);

    List<MatchResult> findByFoundItemIdOrderByOverallScoreDesc(Long foundItemId);

    @Query("SELECT m FROM MatchResult m WHERE (m.lostItemId = :itemId OR m.foundItemId = :itemId) ORDER BY m.overallScore DESC")
    List<MatchResult> findAllMatchesForItem(@Param("itemId") Long itemId);

    @Query("SELECT m FROM MatchResult m WHERE m.overallScore >= :minScore ORDER BY m.overallScore DESC")
    List<MatchResult> findHighConfidenceMatches(@Param("minScore") Double minScore);

    void deleteByLostItemIdOrFoundItemId(Long lostItemId, Long foundItemId);
}
