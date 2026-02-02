package com.jwhisper.udemy.helper.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.jwhisper.udemy.dto.notification.NotificationRequest;
import com.jwhisper.udemy.dto.notification.NotificationResponse;
import com.jwhisper.udemy.model.Notification;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NotificationMapper {
    Notification toNotification(NotificationRequest request);
    NotificationResponse toNotificationResponse(Notification entity);
}

