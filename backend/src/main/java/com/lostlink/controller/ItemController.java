package com.lostlink.controller;

import com.lostlink.dto.ItemRequest;
import com.lostlink.dto.ItemResponse;
import com.lostlink.entity.ItemStatus;
import com.lostlink.entity.ItemType;
import com.lostlink.entity.User;
import com.lostlink.service.AuthService;
import com.lostlink.service.ItemService;
import com.lostlink.service.MatchService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;
    private final AuthService authService;
    private final MatchService matchService;

    public ItemController(ItemService itemService, AuthService authService, MatchService matchService) {
        this.itemService = itemService;
        this.authService = authService;
        this.matchService = matchService;
    }

    @PostMapping
    public ResponseEntity<ItemResponse> createItem(@Valid @RequestBody ItemRequest request) {
        User currentUser = authService.getCurrentUser();
        ItemResponse item = itemService.createItem(request, currentUser);

        // Automatically trigger SmartMatch in background/immediately
        try {
            matchService.recomputeMatchesForItem(item.getId());
        } catch (Exception ignored) {}

        return ResponseEntity.ok(item);
    }

    @GetMapping
    public ResponseEntity<Page<ItemResponse>> searchItems(
        @RequestParam(required = false) ItemType type,
        @RequestParam(required = false) ItemStatus status,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String location,
        @RequestParam(required = false) String query,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        Page<ItemResponse> results = itemService.searchItems(type, status, category, location, query, page, size);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(itemService.getItemById(id));
    }

    @GetMapping("/my-reports")
    public ResponseEntity<List<ItemResponse>> getMyReports() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(itemService.getMyReportedItems(currentUser.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteItem(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        itemService.deleteItem(id, currentUser);
        return ResponseEntity.ok(Map.of("message", "Item report deleted successfully"));
    }
}
