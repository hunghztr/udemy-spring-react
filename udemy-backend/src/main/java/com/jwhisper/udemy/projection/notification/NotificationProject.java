package com.jwhisper.udemy.projection.notification;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationProject {
    String id;
    String title;
    String message;
    String url;
    boolean isRead;
}
