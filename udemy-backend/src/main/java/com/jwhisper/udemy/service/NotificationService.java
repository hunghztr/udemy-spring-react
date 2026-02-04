package com.jwhisper.udemy.service;

import org.springframework.data.domain.Pageable;

import com.jwhisper.udemy.dto.SliceResponse;
import com.jwhisper.udemy.dto.notification.NotificationRequest;
import com.jwhisper.udemy.dto.notification.NotificationResponse;

public interface NotificationService {
    boolean sendRequest(NotificationRequest request);
    boolean mark(String id);
    boolean delete(String id);
    long countNew();
    SliceResponse<NotificationResponse> getAll(Pageable pageable);
}
