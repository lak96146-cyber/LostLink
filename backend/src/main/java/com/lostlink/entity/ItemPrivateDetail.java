package com.lostlink.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "item_private_details")
public class ItemPrivateDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_id", nullable = false, unique = true)
    private Long itemId;

    @Column(name = "serial_number_hash")
    private String serialNumberHash;

    @Column(name = "serial_number_hint")
    private String serialNumberHint; // e.g. "Starts with SN-7***"

    @Column(name = "distinctive_marks", length = 2000)
    private String distinctiveMarks;

    @Column(name = "secret_notes", length = 2000)
    private String secretNotes;

    @Column(name = "secret_pin_or_code_hash")
    private String secretPinOrCodeHash;

    @Column(name = "private_photo_url", length = 500000)
    private String privatePhotoUrl;

    @Column(name = "verification_questions_json", length = 4000)
    private String verificationQuestionsJson; // JSON array of questions with hashed expected answers

    public ItemPrivateDetail() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getSerialNumberHash() { return serialNumberHash; }
    public void setSerialNumberHash(String serialNumberHash) { this.serialNumberHash = serialNumberHash; }

    public String getSerialNumberHint() { return serialNumberHint; }
    public void setSerialNumberHint(String serialNumberHint) { this.serialNumberHint = serialNumberHint; }

    public String getDistinctiveMarks() { return distinctiveMarks; }
    public void setDistinctiveMarks(String distinctiveMarks) { this.distinctiveMarks = distinctiveMarks; }

    public String getSecretNotes() { return secretNotes; }
    public void setSecretNotes(String secretNotes) { this.secretNotes = secretNotes; }

    public String getSecretPinOrCodeHash() { return secretPinOrCodeHash; }
    public void setSecretPinOrCodeHash(String secretPinOrCodeHash) { this.secretPinOrCodeHash = secretPinOrCodeHash; }

    public String getPrivatePhotoUrl() { return privatePhotoUrl; }
    public void setPrivatePhotoUrl(String privatePhotoUrl) { this.privatePhotoUrl = privatePhotoUrl; }

    public String getVerificationQuestionsJson() { return verificationQuestionsJson; }
    public void setVerificationQuestionsJson(String verificationQuestionsJson) { this.verificationQuestionsJson = verificationQuestionsJson; }
}
