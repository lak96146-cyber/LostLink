package com.lostlink.repository;

import com.lostlink.entity.CampusZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CampusZoneRepository extends JpaRepository<CampusZone, Long> {
    Optional<CampusZone> findByCode(String code);
}
