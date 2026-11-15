package com.lostlink.service;

import com.lostlink.dto.ItemRequest;
import com.lostlink.dto.ItemResponse;
import com.lostlink.entity.*;
import com.lostlink.exception.BadRequestException;
import com.lostlink.exception.ResourceNotFoundException;
import com.lostlink.exception.UnauthorizedException;
import com.lostlink.geospatial.CampusGeoService;
import com.lostlink.repository.CampusBuildingRepository;
import com.lostlink.repository.ItemPrivateDetailRepository;
import com.lostlink.repository.ItemRepository;
import com.lostlink.repository.SecurityAuditLogRepository;
import com.lostlink.verification.ItemDnaService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final ItemPrivateDetailRepository privateDetailRepository;
    private final CampusBuildingRepository buildingRepository;
    private final CampusGeoService campusGeoService;
    private final SecurityAuditLogRepository auditLogRepository;
    private final RewardService rewardService;
    private final NotificationService notificationService;

    public ItemService(ItemRepository itemRepository,
                       ItemPrivateDetailRepository privateDetailRepository,
                       CampusBuildingRepository buildingRepository,
                       CampusGeoService campusGeoService,
                       SecurityAuditLogRepository auditLogRepository,
                       RewardService rewardService,
                       NotificationService notificationService) {
        this.itemRepository = itemRepository;
        this.privateDetailRepository = privateDetailRepository;
        this.buildingRepository = buildingRepository;
        this.campusGeoService = campusGeoService;
        this.auditLogRepository = auditLogRepository;
        this.rewardService = rewardService;
        this.notificationService = notificationService;
    }

    @Transactional
    public ItemResponse createItem(ItemRequest request, User currentUser) {
        Item item = new Item();
        item.setTitle(request.getTitle().trim());
        item.setType(request.getType());
        item.setCategory(request.getCategory().trim());
        item.setDescription(request.getDescription());
        item.setBrand(request.getBrand() != null ? request.getBrand().trim() : null);
        item.setColor(request.getColor() != null ? request.getColor().trim() : null);
        item.setDateLostOrFound(request.getDateLostOrFound() != null ? request.getDateLostOrFound() : LocalDate.now());
        item.setLocationName(request.getLocationName().trim());
        item.setBuildingId(request.getBuildingId());
        item.setCampusZone(request.getCampusZone());
        item.setUrgency(request.getUrgency() != null ? request.getUrgency() : UrgencyLevel.MEDIUM);
        item.setIsCritical(request.getIsCritical() != null && request.getIsCritical());
        item.setImageUrl(request.getImageUrl());
        item.setStatus(ItemStatus.REPORTED);
        item.setReporter(currentUser);

        // Geolocation handling: If coordinates supplied, verify within 1000m radius
        Double lat = request.getLatitude();
        Double lng = request.getLongitude();

        if (lat != null && lng != null) {
            if (!campusGeoService.isWithinCampusBoundary(lat, lng)) {
                throw new BadRequestException("The specified coordinates are outside the 1.0 km CGC Jhanjeri campus boundary.");
            }
            item.setLatitude(lat);
            item.setLongitude(lng);
        } else if (request.getBuildingId() != null) {
            buildingRepository.findById(request.getBuildingId()).ifPresent(b -> {
                item.setLatitude(b.getLatitude());
                item.setLongitude(b.getLongitude());
            });
        } else {
            // Default to CGC campus center coordinates
            item.setLatitude(CampusGeoService.CGC_CENTER_LAT);
            item.setLongitude(CampusGeoService.CGC_CENTER_LNG);
        }

        Item savedItem = itemRepository.save(item);

        // Handle Item DNA private ownership registration
        boolean hasDna = false;
        if (request.getSecretIdentifier() != null || request.getSerialNumber() != null ||
            request.getDistinctiveMarks() != null || request.getSecretNotes() != null) {

            ItemPrivateDetail detail = new ItemPrivateDetail();
            detail.setItemId(savedItem.getId());
            if (request.getSerialNumber() != null && !request.getSerialNumber().isBlank()) {
                detail.setSerialNumberHash(ItemDnaService.hashSecret(request.getSerialNumber()));
                String clean = request.getSerialNumber().trim();
                detail.setSerialNumberHint(clean.length() > 3 ? clean.substring(0, 3) + "***" : "***");
            }
            detail.setDistinctiveMarks(request.getDistinctiveMarks());
            detail.setSecretNotes(request.getSecretNotes());
            if (request.getSecretIdentifier() != null && !request.getSecretIdentifier().isBlank()) {
                detail.setSecretPinOrCodeHash(ItemDnaService.hashSecret(request.getSecretIdentifier()));
            }
            detail.setPrivatePhotoUrl(request.getPrivatePhotoUrl());
            detail.setVerificationQuestionsJson(request.getVerificationQuestionsJson());

            privateDetailRepository.save(detail);
            hasDna = true;
        }

        // Audit log
        auditLogRepository.save(new SecurityAuditLog(
            currentUser.getId(), "REPORT_" + savedItem.getType().name(), "127.0.0.1",
            "Created " + savedItem.getType() + " item: " + savedItem.getTitle() + " (ID: " + savedItem.getId() + ")"
        ));

        // Good Samaritan points bonus for reporting found items
        if (savedItem.getType() == ItemType.FOUND) {
            rewardService.addPoints(currentUser.getId(), 25, "Reported found item: " + savedItem.getTitle(), savedItem.getId());
        }

        return ItemResponse.fromEntity(savedItem, hasDna);
    }

    @Transactional(readOnly = true)
    public Page<ItemResponse> searchItems(ItemType type, ItemStatus status, String category, String location, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Item> items = itemRepository.searchItems(type, status, category, location, query, pageable);
        return items.map(item -> {
            boolean hasDna = privateDetailRepository.findByItemId(item.getId()).isPresent();
            return ItemResponse.fromEntity(item, hasDna);
        });
    }

    @Transactional(readOnly = true)
    public ItemResponse getItemById(Long id) {
        Item item = itemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        boolean hasDna = privateDetailRepository.findByItemId(item.getId()).isPresent();
        return ItemResponse.fromEntity(item, hasDna);
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> getMyReportedItems(Long userId) {
        List<Item> items = itemRepository.findByReporterIdOrderByCreatedAtDesc(userId);
        return items.stream().map(item -> {
            boolean hasDna = privateDetailRepository.findByItemId(item.getId()).isPresent();
            return ItemResponse.fromEntity(item, hasDna);
        }).toList();
    }

    @Transactional
    public void deleteItem(Long id, User currentUser) {
        Item item = itemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (!item.getReporter().getId().equals(currentUser.getId()) && currentUser.getRole() != RoleType.ROLE_ADMIN) {
            throw new UnauthorizedException("You are not authorized to delete this report");
        }

        privateDetailRepository.deleteByItemId(id);
        itemRepository.delete(item);

        auditLogRepository.save(new SecurityAuditLog(
            currentUser.getId(), "DELETE_ITEM", "127.0.0.1", "Deleted item: " + item.getTitle() + " (ID: " + id + ")"
        ));
    }

    @Transactional(readOnly = true)
    public List<Item> getAllItemsForRadar() {
        return itemRepository.findAllWithCoordinates();
    }
}
