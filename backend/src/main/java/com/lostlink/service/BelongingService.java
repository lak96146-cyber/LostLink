package com.lostlink.service;

import com.lostlink.dto.BelongingDTO;
import com.lostlink.dto.ItemRequest;
import com.lostlink.dto.ItemResponse;
import com.lostlink.entity.Belonging;
import com.lostlink.entity.ItemType;
import com.lostlink.entity.UrgencyLevel;
import com.lostlink.entity.User;
import com.lostlink.exception.ResourceNotFoundException;
import com.lostlink.exception.UnauthorizedException;
import com.lostlink.repository.BelongingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BelongingService {

    private final BelongingRepository belongingRepository;
    private final ItemService itemService;

    public BelongingService(BelongingRepository belongingRepository, ItemService itemService) {
        this.belongingRepository = belongingRepository;
        this.itemService = itemService;
    }

    @Transactional
    public BelongingDTO addBelonging(BelongingDTO dto, User user) {
        Belonging b = new Belonging();
        b.setUser(user);
        b.setName(dto.getName().trim());
        b.setCategory(dto.getCategory().trim());
        b.setBrand(dto.getBrand());
        b.setColor(dto.getColor());
        b.setSerialNumber(dto.getSerialNumber());
        b.setDistinctiveMarks(dto.getDistinctiveMarks());
        b.setEstimatedValue(dto.getEstimatedValue());
        b.setImageUrl(dto.getImageUrl());

        Belonging saved = belongingRepository.save(b);
        return BelongingDTO.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<BelongingDTO> getMyBelongings(Long userId) {
        return belongingRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
            .map(BelongingDTO::fromEntity)
            .toList();
    }

    @Transactional
    public void deleteBelonging(Long id, Long userId) {
        Belonging b = belongingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Belonging not found"));

        if (!b.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Unauthorized to delete this belonging");
        }

        belongingRepository.delete(b);
    }

    @Transactional
    public ItemResponse reportBelongingAsLost(Long belongingId, String locationName, Long buildingId, User user) {
        Belonging b = belongingRepository.findById(belongingId)
            .orElseThrow(() -> new ResourceNotFoundException("Belonging not found"));

        if (!b.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized access to this belonging");
        }

        ItemRequest request = new ItemRequest();
        request.setTitle(b.getName());
        request.setType(ItemType.LOST);
        request.setCategory(b.getCategory());
        request.setDescription("Registered belonging: " + b.getName() + ". " + (b.getDistinctiveMarks() != null ? b.getDistinctiveMarks() : ""));
        request.setBrand(b.getBrand());
        request.setColor(b.getColor());
        request.setDateLostOrFound(LocalDate.now());
        request.setLocationName(locationName != null ? locationName : "CGC Campus");
        request.setBuildingId(buildingId);
        request.setUrgency(UrgencyLevel.HIGH);
        request.setImageUrl(b.getImageUrl());
        request.setSerialNumber(b.getSerialNumber());
        request.setDistinctiveMarks(b.getDistinctiveMarks());

        return itemService.createItem(request, user);
    }
}
