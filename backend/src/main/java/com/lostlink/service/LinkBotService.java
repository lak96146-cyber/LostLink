package com.lostlink.service;

import com.lostlink.dto.LinkBotDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LinkBotService {

    public LinkBotDTO.MessageResponse processMessage(LinkBotDTO.MessageRequest request) {
        String msg = (request.getMessage() != null) ? request.getMessage().trim().toLowerCase() : "";

        if (msg.contains("lost") && (msg.contains("report") || msg.contains("how") || msg.contains("file") || msg.contains("my"))) {
            return new LinkBotDTO.MessageResponse(
                "To report a lost item, click 'Report Lost'. Be sure to provide the approximate location on the campus map and fill in the Item DNA section with unique identifiers (serial number, distinctive scratches, or stickers). Your private details stay completely hidden and help verify you as the genuine owner when found!",
                "REPORT_LOST",
                List.of("What is Item DNA?", "Check current matches", "Explore CampusVerse"),
                "/report-lost",
                "Open Report Lost Form"
            );
        }

        if (msg.contains("found") && (msg.contains("report") || msg.contains("turned in") || msg.contains("submit") || msg.contains("picked up"))) {
            return new LinkBotDTO.MessageResponse(
                "Thank you for being a Good Samaritan! You can report the item under 'Report Found'. You'll earn +25 Good Samaritan points immediately. You can choose to hand it over directly or deposit it in the Smart Lost Locker at Block 1 Security Desk.",
                "REPORT_FOUND",
                List.of("Where is the Lost Locker?", "Check leaderboard", "SafeReturn process"),
                "/report-found",
                "Report Found Item"
            );
        }

        if (msg.contains("match") || msg.contains("smartmatch") || msg.contains("score") || msg.contains("algorithm")) {
            return new LinkBotDTO.MessageResponse(
                "LostLink's SmartMatch engine continuously cross-evaluates active reports using a 7-factor weighted algorithm: Name (25%), Category (20%), Description (15%), Location Proximity (15%), Date Proximity (10%), Color (10%), and Brand (5%). A score >= 75% indicates a Strong Match!",
                "SMARTMATCH_INFO",
                List.of("View my matches", "Search campus radar", "Report an item"),
                "/smartmatch",
                "View SmartMatch Hub"
            );
        }

        if (msg.contains("dna") || msg.contains("verify") || msg.contains("proof") || msg.contains("secret")) {
            return new LinkBotDTO.MessageResponse(
                "Item DNA is LostLink's zero-knowledge ownership verification framework. The true owner registers secret traits (serial hash, unique marks, private photos) upon reporting. When someone claims the item, their answers are compared without ever exposing the original answers to anyone!",
                "ITEM_DNA_INFO",
                List.of("Submit a claim", "My Belongings Vault", "How does SafeReturn work?"),
                "/vault",
                "Go to Belongings Vault"
            );
        }

        if (msg.contains("safereturn") || msg.contains("qr") || msg.contains("handover") || msg.contains("pickup") || msg.contains("code")) {
            return new LinkBotDTO.MessageResponse(
                "SafeReturn is our QR and OTP-protected recovery workflow. Once campus admin verifies ownership, a unique encrypted QR code and 6-digit one-time handover PIN are generated. Both parties verify at the security desk to safely recover the item and generate a tamper-evident digital receipt.",
                "SAFERETURN_GUIDANCE",
                List.of("View my claims", "Where is Block 1?", "Contact campus security"),
                "/my-claims",
                "View My Claims & QR"
            );
        }

        if (msg.contains("campus") || msg.contains("3d") || msg.contains("map") || msg.contains("verse") || msg.contains("jhanjeri") || msg.contains("building") || msg.contains("navigate")) {
            return new LinkBotDTO.MessageResponse(
                "CampusVerse is a geographically grounded 3D digital twin of CGC University, Jhanjeri, bounded strictly to a 1.0 km radius (30.68114° N, 76.60584° E). You can view real OpenStreetMap buildings (Block 1, 2, 3, 4, Hostels, Sports Complex), inspect real Lost Radar markers, and navigate walking routes!",
                "CAMPUS_NAV",
                List.of("Open CampusVerse 3D", "Walk to Block 2", "View Lost Radar"),
                "/campusverse",
                "Enter CampusVerse 3D"
            );
        }

        if (msg.contains("points") || msg.contains("reward") || msg.contains("samaritan") || msg.contains("leaderboard") || msg.contains("badge")) {
            return new LinkBotDTO.MessageResponse(
                "Good Samaritan Points are earned through verified community actions: +10 on registration, +25 for reporting a found item, +50 for completed SafeReturn handovers, and special badges (e.g. 'Campus Samaritan', 'Eagle Eye'). Check the Hall of Helpers leaderboard!",
                "REWARDS_FAQ",
                List.of("Open Leaderboard", "View my profile", "Report found item"),
                "/community",
                "View Community Hub"
            );
        }

        if (msg.contains("locker") || msg.contains("vault") || msg.contains("storage")) {
            return new LinkBotDTO.MessageResponse(
                "The Smart Lost Locker is located at the Ground Floor Security Desk of Block 1 (Admin & Central Library). High-value items (laptops, wallets, documents) are cataloged into numbered compartments with tamper-evident digital intake records.",
                "LOCKER_INFO",
                List.of("Where is Block 1?", "Report found item", "Contact Guardian Admin"),
                "/campusverse",
                "Locate Locker in CampusVerse"
            );
        }

        // Default contextual greeting
        return new LinkBotDTO.MessageResponse(
            "Hello! I am LinkBot, your CGC Jhanjeri campus recovery assistant. I can guide you through reporting lost or found items, tracking SmartMatch confidence, verifying ownership with Item DNA, or navigating the 3D CampusVerse. How can I help you today?",
            "GENERAL_ASSIST",
            List.of("How to report a lost item?", "What is CampusVerse 3D?", "Explain SmartMatch", "SafeReturn QR workflow"),
            "/discover",
            "Explore Lost & Found Items"
        );
    }
}
