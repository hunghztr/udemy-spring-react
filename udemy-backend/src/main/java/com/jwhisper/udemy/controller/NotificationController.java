package com.jwhisper.udemy.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jwhisper.udemy.dto.SliceResponse;
import com.jwhisper.udemy.dto.notification.NotificationRequest;
import com.jwhisper.udemy.dto.notification.NotificationResponse;
import com.jwhisper.udemy.helper.annotation.ApiMessage;
import com.jwhisper.udemy.service.NotificationService;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    public NotificationController(NotificationService notificationService){
        this.notificationService = notificationService;
    }
    @PostMapping()
    @ApiMessage("Gửi thông báo thành công")
    public ResponseEntity<?> sendRequest(@RequestBody NotificationRequest request) {
        boolean isCreated = this.notificationService.sendRequest(request);
        return ResponseEntity.ok(isCreated);
    }
    @GetMapping()
    @ApiMessage("Lấy danh sách thông báo thành công")
    public ResponseEntity<?> getAll(@PageableDefault(
        page = 0, size = 10,sort = "createdAt",direction = Sort.Direction.DESC
    ) Pageable pageable) {
        SliceResponse<NotificationResponse> slice = this.notificationService.getAll(pageable);
        return ResponseEntity.ok(slice);
    }
    @PostMapping("/{id}")
    @ApiMessage("Đánh dấu đã đọc tin")
    public ResponseEntity<?> mark(@PathVariable("id") String id) {
        boolean isMark = this.notificationService.mark(id);
        return ResponseEntity.ok(isMark);
    }
    
}
