package com.lostlink.repository;

import com.lostlink.entity.Item;
import com.lostlink.entity.ItemStatus;
import com.lostlink.entity.ItemType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByType(ItemType type);

    List<Item> findByReporterIdOrderByCreatedAtDesc(Long reporterId);

    List<Item> findByTypeAndStatusNot(ItemType type, ItemStatus status);

    @Query("SELECT i FROM Item i WHERE " +
           "(:type IS NULL OR i.type = :type) AND " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:category IS NULL OR LOWER(i.category) = LOWER(:category)) AND " +
           "(:location IS NULL OR LOWER(i.locationName) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:query IS NULL OR (" +
           "  LOWER(i.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "  LOWER(i.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "  LOWER(i.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "  LOWER(i.color) LIKE LOWER(CONCAT('%', :query, '%'))" +
           ")) " +
           "ORDER BY i.createdAt DESC")
    Page<Item> searchItems(
        @Param("type") ItemType type,
        @Param("status") ItemStatus status,
        @Param("category") String category,
        @Param("location") String location,
        @Param("query") String query,
        Pageable pageable
    );

    long countByType(ItemType type);

    long countByStatus(ItemStatus status);

    @Query("SELECT i.category, COUNT(i) FROM Item i GROUP BY i.category")
    List<Object[]> countGroupByCategory();

    @Query("SELECT i.locationName, COUNT(i) FROM Item i GROUP BY i.locationName ORDER BY COUNT(i) DESC")
    List<Object[]> countGroupByLocation();

    @Query("SELECT i FROM Item i WHERE i.latitude IS NOT NULL AND i.longitude IS NOT NULL")
    List<Item> findAllWithCoordinates();
}
