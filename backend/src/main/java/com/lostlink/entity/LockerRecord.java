package com.lostlink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "locker_records", indexes = {
    @Index(name = "idx_locker_ref", columnList = "locker_reference"),
    @Index(name = "idx_locker_status", columnList = "status")
})
public class LockerRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "locker_reference", nullable = false, unique = true)
    private String lockerReference;

    @Column(name = "physical_location", nullable = false)
    private String physicalLocation;

    @Column(name = "item_id")
    private Long itemId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LockerStatus status = LockerStatus.AVAILABLE;

    @Column(name = "intake_date")
    private LocalDateTime intakeDate;

    @Column(name = "release_date")
    private LocalDateTime releaseDate;

    @Column(name = "assigned_admin_id")
    private Long assignedAdminId;

    @Column(name = "access_code_hash")
    private String accessCodeHash;

    private String notes;

    public LockerRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLockerReference() { return lockerReference; }
    public void setLockerReference(String lockerReference) { this.lockerReference = lockerReference; }

    public String getPhysicalLocation() { return physicalLocation; }
    public void setPhysicalLocation(String physicalLocation) { this.physicalLocation = physicalLocation; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public LockerStatus getStatus() { return status; }
    public void setStatus(LockerStatus status) { this.status = status; }

    public LocalDateTime getIntakeDate() { return intakeDate; }
    public void setIntakeDate(LocalDateTime intakeDate) { this.intakeDate = intakeDate; }

    public LocalDateTime getReleaseDate() { return releaseDate; }
    public void setReleaseDate(LocalDateTime releaseDate) { this.releaseDate = releaseDate; }

    public Long getAssignedAdminId() { return assignedAdminId; }
    public void setAssignedAdminId(Long assignedAdminId) { this.assignedAdminId = assignedAdminId; }

    public String getAccessCodeHash() { return accessCodeHash; }
    public void setAccessCodeHash(String accessCodeHash) { this.accessCodeHash = accessCodeHash; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
