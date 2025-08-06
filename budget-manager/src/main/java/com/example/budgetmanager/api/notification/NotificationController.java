package com.example.budgetmanager.api.notification;

import com.example.budgetmanager.domain.notification.Notification;
import com.example.budgetmanager.domain.notification.NotificationRepository;
import com.example.budgetmanager.domain.user.User;
import com.example.budgetmanager.domain.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationController(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        User user = findUserByEmail(userDetails.getUsername());
        List<Notification> notifications = notificationRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId());

        List<NotificationDto> dtos = notifications.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{id}/mark-as-read")
    @ResponseStatus(HttpStatus.OK)
    @Transactional
    public void markAsRead(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = findUserByEmail(userDetails.getUsername());
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));

        // SECURITY CHECK: Ensure the user owns the notification
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to modify this notification.");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Authenticated user not found in database."));
    }


    private NotificationDto toDto(Notification n) {
        return new NotificationDto(n.getId(), n.getMessage(), n.getType(), n.isRead(), n.getCreatedAt());
    }
}