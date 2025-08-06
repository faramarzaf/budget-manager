package com.example.budgetmanager.domain.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByUserIdAndMessage(Long userId, String message);
}