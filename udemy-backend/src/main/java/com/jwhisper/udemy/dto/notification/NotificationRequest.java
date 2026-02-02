package com.jwhisper.udemy.dto.notification;

import com.jwhisper.udemy.dto.user.UserRequest;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationRequest {
    String title;
    String message;
    String url;
    UserRequest user;
}
