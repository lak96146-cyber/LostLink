package com.lostlink.service;

import com.lostlink.dto.ClaimRequest;
import com.lostlink.dto.ClaimResponse;
import com.lostlink.dto.ItemResponse;
import com.lostlink.dto.SafeReturnHandoverResponse;
import com.lostlink.entity.*;
import com.lostlink.exception.BadRequestException;
import com.lostlink.exception.ResourceNotFoundException;
import com.lostlink.repository.*;
import com.lostlink.verification.ItemDnaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;
    private final ItemPrivateDetailRepository privateDetailRepository;
    private final SafeReturnHandoverRepository handoverRepository;
    private final SecurityAuditLogRepository auditLogRepository;
    private final ItemDnaService itemDnaService;
    private final SafeReturnService safeReturnService;
    private final NotificationService notificationService;

    public ClaimService(ClaimRepository claimRepository,
                        ItemRepository itemRepository,
                        ItemPrivateDetailRepository privateDetailRepository,
                        SafeReturnHandoverRepository handoverRepository,
                        SecurityAuditLogRepository auditLogRepository,
                        ItemDnaService itemDnaService,
                        SafeReturnService safeReturnService,
                        NotificationService notificationService) {
        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
        this.privateDetailRepository = privateDetailRepository;
        this.handoverRepository = handoverRepository;
        this.auditLogRepository = auditLogRepository;
        this.itemDnaService = itemDnaService;
        this.safeReturnService = safeReturnService;
        this.notificationService = notificationService;
    }

    @Transactional
    public ClaimResponse submitClaim(ClaimRequest request, User claimant) {
        Item foundItem = itemRepository.findById(request.getFoundItemId())
            .orElseThrow(() -> new ResourceNotFoundException("Found item not found"));

        if (foundItem.getType() != ItemType.FOUND) {
            throw new BadRequestException("You can only submit claims on reported found items.");
        }

        if (foundItem.getReporter().getId().equals(claimant.getId())) {
            throw new BadRequestException("You cannot claim an item that you reported finding.");
        }

        // Prevent duplicate pending claims from the same student
        Optional<Claim> existingClaim = claimRepository.findByFoundItemIdAndClaimantId(foundItem.getId(), claimant.getId());
        if (existingClaim.isPresent() && (existingClaim.get().getStatus() == ClaimStatus.UNDER_ADMIN_REVIEW ||
            existingClaim.get().getStatus() == ClaimStatus.APPROVED)) {
            throw new BadRequestException("You already have an active claim on this item.");
        }

        // Evaluate ownership evidence using Item DNA
        double verificationScore = itemDnaService.evaluateOwnershipProof(
            foundItem.getId(),
            request.getSerialNumberAttempt(),
            request.getDistinctiveMarksAttempt(),
            request.getVerificationAnswersJson()
        );

        RiskLevel riskLevel = itemDnaService.computeClaimRisk(foundItem.getId(), claimant.getId(), verificationScore);

        Claim claim = new Claim();
        claim.setFoundItemId(foundItem.getId());
        claim.setLostItemId(request.getLostItemId());
        claim.setClaimant(claimant);
        claim.setClaimDescription(request.getClaimDescription());
        claim.setSerialNumberAttempt(request.getSerialNumberAttempt());
        claim.setDistinctiveMarksAttempt(request.getDistinctiveMarksAttempt());
        claim.setClaimantProofImage(request.getClaimantProofImage());
        claim.setVerificationScore(verificationScore);
        claim.setRiskLevel(riskLevel);
        claim.setStatus(ClaimStatus.UNDER_ADMIN_REVIEW);

        Claim savedClaim = claimRepository.save(claim);

        // Update item status to UNDER_VERIFICATION
        foundItem.setStatus(ItemStatus.UNDER_VERIFICATION);
        itemRepository.save(foundItem);

        auditLogRepository.save(new SecurityAuditLog(
            claimant.getId(), "CLAIM_SUBMITTED", "127.0.0.1",
            "Submitted claim for found item ID " + foundItem.getId() + " (Score: " + verificationScore + "%)"
        ));

        // Notify claimant
        notificationService.createNotification(
            claimant.getId(),
            "Claim Submitted: " + foundItem.getTitle(),
            "Your ownership claim has been submitted for verification and administrative review.",
            NotificationType.CLAIM_SUBMITTED,
            "/my-claims"
        );

        return toResponse(savedClaim);
    }

    @Transactional
    public ClaimResponse reviewClaim(Long claimId, boolean approve, String adminNotes, User admin) {
        Claim claim = claimRepository.findById(claimId)
            .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        Item foundItem = itemRepository.findById(claim.getFoundItemId())
            .orElseThrow(() -> new ResourceNotFoundException("Found item not found"));

        claim.setReviewedBy(admin);
        claim.setAdminNotes(adminNotes);

        if (approve) {
            claim.setStatus(ClaimStatus.APPROVED);
            foundItem.setStatus(ItemStatus.CLAIMED);
            itemRepository.save(foundItem);

            // Initiate SafeReturn handover QR & OTP
            safeReturnService.createHandoverForClaim(claim.getId(), "CGC Main Security Desk, Block 1 - Admin Building");

            auditLogRepository.save(new SecurityAuditLog(
                admin.getId(), "CLAIM_APPROVED", "127.0.0.1",
                "Approved claim #" + claim.getId() + " by user " + claim.getClaimant().getEmail()
            ));

            notificationService.createNotification(
                claim.getClaimant().getId(),
                "Claim Approved! SafeReturn QR Ready",
                "Your ownership claim on '" + foundItem.getTitle() + "' has been verified and approved by campus security.",
                NotificationType.CLAIM_APPROVED,
                "/my-claims"
            );
        } else {
            claim.setStatus(ClaimStatus.REJECTED);
            foundItem.setStatus(ItemStatus.REPORTED);
            itemRepository.save(foundItem);

            auditLogRepository.save(new SecurityAuditLog(
                admin.getId(), "CLAIM_REJECTED", "127.0.0.1",
                "Rejected claim #" + claim.getId() + ". Notes: " + adminNotes
            ));

            notificationService.createNotification(
                claim.getClaimant().getId(),
                "Claim Rejected",
                "Your ownership claim on '" + foundItem.getTitle() + "' could not be verified. Note: " + adminNotes,
                NotificationType.CLAIM_REJECTED,
                "/my-claims"
            );
        }

        Claim updated = claimRepository.save(claim);
        return toResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<ClaimResponse> getMyClaims(Long userId) {
        return claimRepository.findByClaimantIdOrderByCreatedAtDesc(userId).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ClaimResponse> getAllClaimsForAdmin() {
        return claimRepository.findAll().stream().map(this::toResponse).toList();
    }

    private ClaimResponse toResponse(Claim claim) {
        Item found = itemRepository.findById(claim.getFoundItemId()).orElse(null);
        boolean hasDna = found != null && privateDetailRepository.findByItemId(found.getId()).isPresent();
        ItemResponse itemResp = ItemResponse.fromEntity(found, hasDna);

        SafeReturnHandoverResponse handoverResp = handoverRepository.findByClaimId(claim.getId())
            .map(SafeReturnHandoverResponse::fromEntity)
            .orElse(null);

        return ClaimResponse.fromEntity(claim, itemResp, handoverResp);
    }
}
