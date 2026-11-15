package com.lostlink.repository;

import com.lostlink.entity.ItemPrivateDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemPrivateDetailRepository extends JpaRepository<ItemPrivateDetail, Long> {
    Optional<ItemPrivateDetail> findByItemId(Long itemId);
    void deleteByItemId(Long itemId);
}
