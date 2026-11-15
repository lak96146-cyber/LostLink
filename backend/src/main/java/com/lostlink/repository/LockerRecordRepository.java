package com.lostlink.repository;

import com.lostlink.entity.LockerRecord;
import com.lostlink.entity.LockerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LockerRecordRepository extends JpaRepository<LockerRecord, Long> {
    Optional<LockerRecord> findByLockerReference(String lockerReference);
    Optional<LockerRecord> findByItemId(Long itemId);
    List<LockerRecord> findByStatus(LockerStatus status);
}
