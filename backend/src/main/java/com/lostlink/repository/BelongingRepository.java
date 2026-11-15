package com.lostlink.repository;

import com.lostlink.entity.Belonging;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BelongingRepository extends JpaRepository<Belonging, Long> {
    List<Belonging> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserId(Long userId);
}
