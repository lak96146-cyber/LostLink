package com.lostlink.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.lostlink.dto.SafeReturnHandoverResponse;
import com.lostlink.entity.*;
import com.lostlink.exception.BadRequestException;
import com.lostlink.exception.ResourceNotFoundException;
import com.lostlink.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
public class SafeReturnService {

    private final SafeReturnHandoverRepository handoverRepository;
    private final ClaimRepository claimRepository;
    private final ItemRepository itemRepository;
    private final SecurityAuditLogRepository auditLogRepository;
    private final RewardService rewardService;
    private final NotificationService notificationService;
    private final SecureRandom random = new SecureRandom();

    public SafeReturnService(SafeReturnHandoverRepository handoverRepository,
                             ClaimRepository claimRepository,
                             ItemRepository itemRepository,
                             SecurityAuditLogRepository auditLogRepository,
                             RewardService rewardService,
                             NotificationService notificationService) {
        this.handoverRepository = handoverRepository;
        this.claimRepository = claimRepository;
        this.itemRepository = itemRepository;
        this.auditLogRepository = auditLogRepository;
        this.rewardService = rewardService;
        this.notificationService = notificationService;
    }

    @Transactional
    public SafeReturnHandover createHandoverForClaim(Long claimId, String handoverLocation) {
        // Check if handover already exists
        return handoverRepository.findByClaimId(claimId).orElseGet(() -> {
            String otp = String.format("%06d", random.nextInt(900000) + 100000);
            String qrToken = "SR-" + UUID.randomUUID().toString().substring(0, 18).toUpperCase();
            String qrBase64 = generateQrBase64("LOSTLINK-SAFERETURN:" + qrToken);

            SafeReturnHandover handover = new SafeReturnHandover();
            handover.setClaimId(claimId);
            handover.setHandoverCode(otp);
            handover.setQrToken(qrToken);
            handover.setQrCodeBase64(qrBase64);
            handover.setStatus(HandoverStatus.SCHEDULED);
            handover.setHandoverLocation(handoverLocation);
            handover.setScheduledTime(LocalDateTime.now().plusDays(2));

            return handoverRepository.save(handover);
        });
    }

    @Transactional
    public SafeReturnHandoverResponse verifyAndCompleteHandover(Long claimId, String codeOrToken, User verifyingUser) {
        SafeReturnHandover handover = handoverRepository.findByClaimId(claimId)
            .orElseThrow(() -> new ResourceNotFoundException("No handover record found for claim #" + claimId));

        if (handover.getStatus() == HandoverStatus.COMPLETED) {
            throw new BadRequestException("This handover has already been completed.");
        }

        String input = codeOrToken.trim();
        boolean matchedCode = handover.getHandoverCode().equalsIgnoreCase(input);
        boolean matchedToken = handover.getQrToken().equalsIgnoreCase(input) || input.contains(handover.getQrToken());

        if (!matchedCode && !matchedToken) {
            throw new BadRequestException("Invalid Handover Code or QR Token. Handover verification failed.");
        }

        Claim claim = claimRepository.findById(handover.getClaimId())
            .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        Item foundItem = itemRepository.findById(claim.getFoundItemId())
            .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        // Mark Handover Completed
        handover.setStatus(HandoverStatus.COMPLETED);
        handover.setCompletedTime(LocalDateTime.now());
        String receiptId = "REC-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        handover.setDigitalReceiptId(receiptId);
        handoverRepository.save(handover);

        // Mark Claim Completed
        claim.setStatus(ClaimStatus.COMPLETED);
        claimRepository.save(claim);

        // Mark Item RECOVERED
        foundItem.setStatus(ItemStatus.RECOVERED);
        itemRepository.save(foundItem);

        // Also if linked to a lost report, mark that recovered
        if (claim.getLostItemId() != null) {
            itemRepository.findById(claim.getLostItemId()).ifPresent(lost -> {
                lost.setStatus(ItemStatus.RECOVERED);
                itemRepository.save(lost);
            });
        }

        // Award Good Samaritan Points to Finder (50 bonus points)
        rewardService.addPoints(foundItem.getReporter().getId(), 50, "Successfully completed safe handover of " + foundItem.getTitle(), foundItem.getId());
        rewardService.checkAndAwardAchievement(foundItem.getReporter().getId(), "HONORABLE_RECOVERY", "Campus Samaritan", "Successfully returned a lost item to its verified owner.", "shield-check");

        // Audit log
        auditLogRepository.save(new SecurityAuditLog(
            verifyingUser.getId(), "HANDOVER_COMPLETED", "127.0.0.1",
            "Handover verified. Item ID " + foundItem.getId() + " recovered. Receipt: " + receiptId
        ));

        // Notifications
        notificationService.createNotification(
            claim.getClaimant().getId(),
            "Item Recovered! Digital Receipt: " + receiptId,
            "Your handover for '" + foundItem.getTitle() + "' has been successfully verified. Receipt ID: " + receiptId,
            NotificationType.ITEM_RECOVERED,
            "/my-claims"
        );

        notificationService.createNotification(
            foundItem.getReporter().getId(),
            "Item Safely Recovered (+50 Points)",
            "The item you found ('" + foundItem.getTitle() + "') was recovered by its owner. 50 Good Samaritan points awarded!",
            NotificationType.ITEM_RECOVERED,
            "/community"
        );

        return SafeReturnHandoverResponse.fromEntity(handover);
    }

    public String generateQrBase64(String content) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, 300, 300);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(outputStream.toByteArray());
        } catch (Exception e) {
            return null;
        }
    }
}
