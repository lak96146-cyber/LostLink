package com.lostlink.repository;

import com.lostlink.entity.HandoverStatus;
import com.lostlink.entity.SafeReturnHandover;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SafeReturnHandoverRepository extends JpaRepository<SafeReturnHandover, Long> {
    Optional<SafeReturnHandover> findByClaimId(Long claimId);
    Optional<SafeReturnHandover> findByQrToken(String qrToken);
    Optional<SafeReturnHandover> findByHandoverCode(String handoverCode);
    List<SafeReturnHandover> findByStatusOrderByCreatedAtDesc(HandoverStatus status);
}
