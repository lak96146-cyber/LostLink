package com.lostlink.repository;

import com.lostlink.entity.Claim;
import com.lostlink.entity.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByClaimantIdOrderByCreatedAtDesc(Long claimantId);

    List<Claim> findByFoundItemIdOrderByCreatedAtDesc(Long foundItemId);

    List<Claim> findByStatusOrderByCreatedAtDesc(ClaimStatus status);

    Optional<Claim> findByFoundItemIdAndClaimantId(Long foundItemId, Long claimantId);

    long countByStatus(ClaimStatus status);
}
