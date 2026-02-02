package com.jwhisper.udemy.dto.notification;

import java.time.Instant;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {
    String id;
    String title;
    String message;
    String url;
    boolean isRead;
    Instant createdAt;
}
