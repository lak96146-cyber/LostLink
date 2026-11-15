package com.lostlink.service;

import com.lostlink.entity.Item;
import com.lostlink.entity.SecurityAuditLog;
import com.lostlink.repository.ItemRepository;
import com.lostlink.repository.SecurityAuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExportService {

    private final ItemRepository itemRepository;
    private final SecurityAuditLogRepository auditLogRepository;

    public ExportService(ItemRepository itemRepository, SecurityAuditLogRepository auditLogRepository) {
        this.itemRepository = itemRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(readOnly = true)
    public String exportItemsToCsv() {
        List<Item> items = itemRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Type,Title,Category,Brand,Color,Date,Location,Urgency,Status,Reporter\n");

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (Item item : items) {
            csv.append(item.getId()).append(",")
               .append(item.getType()).append(",")
               .append(escapeCsv(item.getTitle())).append(",")
               .append(escapeCsv(item.getCategory())).append(",")
               .append(escapeCsv(item.getBrand())).append(",")
               .append(escapeCsv(item.getColor())).append(",")
               .append(item.getDateLostOrFound() != null ? item.getDateLostOrFound().format(fmt) : "").append(",")
               .append(escapeCsv(item.getLocationName())).append(",")
               .append(item.getUrgency()).append(",")
               .append(item.getStatus()).append(",")
               .append(escapeCsv(item.getReporter() != null ? item.getReporter().getFullName() : "Anonymous")).append("\n");
        }
        return csv.toString();
    }

    @Transactional(readOnly = true)
    public String exportAuditLogsToCsv() {
        List<SecurityAuditLog> logs = auditLogRepository.findTop50ByOrderByCreatedAtDesc();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Timestamp,User ID,Action,IP Address,Details\n");

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        for (SecurityAuditLog log : logs) {
            csv.append(log.getId()).append(",")
               .append(log.getCreatedAt().format(fmt)).append(",")
               .append(log.getUserId() != null ? log.getUserId() : "").append(",")
               .append(escapeCsv(log.getAction())).append(",")
               .append(escapeCsv(log.getIpAddress())).append(",")
               .append(escapeCsv(log.getDetails())).append("\n");
        }
        return csv.toString();
    }

    private String escapeCsv(String val) {
        if (val == null) return "";
        String clean = val.replace("\"", "\"\"");
        if (clean.contains(",") || clean.contains("\n") || clean.contains("\"")) {
            return "\"" + clean + "\"";
        }
        return clean;
    }
}
