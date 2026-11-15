package com.lostlink.repository;

import com.lostlink.entity.SecurityAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityAuditLogRepository extends JpaRepository<SecurityAuditLog, Long> {
    Page<SecurityAuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<SecurityAuditLog> findTop50ByOrderByCreatedAtDesc();
}
