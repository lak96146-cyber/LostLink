package com.lostlink.repository;

import com.lostlink.entity.CampusBuilding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CampusBuildingRepository extends JpaRepository<CampusBuilding, Long> {
    Optional<CampusBuilding> findByCode(String code);
    Optional<CampusBuilding> findByName(String name);
}
