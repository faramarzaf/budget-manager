package com.example.budgetmanager.api.notification;

import com.example.budgetmanager.domain.notification.NotificationType;
import java.time.Instant;

public record NotificationDto(
        Long id,
        String message,
        NotificationType type,
        boolean isRead,
        Instant createdAt
) {}