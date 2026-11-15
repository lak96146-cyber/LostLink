package com.lostlink.repository;

import com.lostlink.entity.CampusPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampusPathRepository extends JpaRepository<CampusPath, Long> {
    List<CampusPath> findByFromBuildingId(Long fromBuildingId);
    List<CampusPath> findByFromBuildingIdOrToBuildingId(Long fromBuildingId, Long toBuildingId);
}
