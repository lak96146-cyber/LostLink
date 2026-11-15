package com.lostlink.service;

import com.lostlink.entity.Item;
import com.lostlink.entity.LockerRecord;
import com.lostlink.entity.LockerStatus;
import com.lostlink.exception.BadRequestException;
import com.lostlink.exception.ResourceNotFoundException;
import com.lostlink.repository.ItemRepository;
import com.lostlink.repository.LockerRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LockerService {

    private final LockerRecordRepository lockerRepository;
    private final ItemRepository itemRepository;

    public LockerService(LockerRecordRepository lockerRepository, ItemRepository itemRepository) {
        this.lockerRepository = lockerRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional(readOnly = true)
    public List<LockerRecord> getAllLockers() {
        return lockerRepository.findAll();
    }

    @Transactional
    public LockerRecord assignItemToLocker(Long lockerId, Long itemId, Long adminId, String notes) {
        LockerRecord locker = lockerRepository.findById(lockerId)
            .orElseThrow(() -> new ResourceNotFoundException("Locker not found"));

        if (locker.getStatus() != LockerStatus.AVAILABLE) {
            throw new BadRequestException("Locker " + locker.getLockerReference() + " is currently " + locker.getStatus());
        }

        Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        locker.setItemId(item.getId());
        locker.setStatus(LockerStatus.OCCUPIED);
        locker.setIntakeDate(LocalDateTime.now());
        locker.setAssignedAdminId(adminId);
        locker.setNotes(notes);

        return lockerRepository.save(locker);
    }

    @Transactional
    public LockerRecord releaseLocker(Long lockerId) {
        LockerRecord locker = lockerRepository.findById(lockerId)
            .orElseThrow(() -> new ResourceNotFoundException("Locker not found"));

        locker.setItemId(null);
        locker.setStatus(LockerStatus.AVAILABLE);
        locker.setReleaseDate(LocalDateTime.now());
        return lockerRepository.save(locker);
    }
}
