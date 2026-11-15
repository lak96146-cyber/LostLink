package com.lostlink.controller;

import com.lostlink.dto.LinkBotDTO;
import com.lostlink.service.LinkBotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/linkbot")
public class LinkBotController {

    private final LinkBotService linkBotService;

    public LinkBotController(LinkBotService linkBotService) {
        this.linkBotService = linkBotService;
    }

    @PostMapping("/chat")
    public ResponseEntity<LinkBotDTO.MessageResponse> chat(@RequestBody LinkBotDTO.MessageRequest request) {
        return ResponseEntity.ok(linkBotService.processMessage(request));
    }
}
