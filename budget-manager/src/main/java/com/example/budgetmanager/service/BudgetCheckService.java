package com.example.budgetmanager.service;

import com.example.budgetmanager.domain.budget.Budget;
import com.example.budgetmanager.domain.budget.BudgetRepository;
import com.example.budgetmanager.domain.notification.Notification;
import com.example.budgetmanager.domain.notification.NotificationRepository;
import com.example.budgetmanager.domain.notification.NotificationType;
import com.example.budgetmanager.domain.transaction.Transaction;
import com.example.budgetmanager.domain.transaction.TransactionRepository;
import com.example.budgetmanager.domain.user.User;
import com.example.budgetmanager.domain.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BudgetCheckService {

    private static final Logger log = LoggerFactory.getLogger(BudgetCheckService.class);
    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;
    private final NotificationRepository notificationRepository;

    public BudgetCheckService(UserRepository userRepository, BudgetRepository budgetRepository, TransactionRepository transactionRepository, NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
        this.notificationRepository = notificationRepository;
    }

    // This cron expression means "run at 9:00 AM every day"
    @Scheduled(cron = "0 * * * * ?")
    @Transactional
    public void checkBudgetsAndCreateNotifications() {
        log.info("Starting daily budget check job...");
        List<User> users = userRepository.findAll();

        for (User user : users) {
            processBudgetsForUser(user);
        }
        log.info("Finished daily budget check job.");
    }

    private void processBudgetsForUser(User user) {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);
        List<Budget> budgets = budgetRepository.findAllByUserIdAndMonth(user.getId(), monthStart);

        if (budgets.isEmpty()) return;

        List<Transaction> transactions = transactionRepository.findAllByUserIdAndTransactionDateBetween(user.getId(), monthStart, today);

        // Calculate total spending per category for the month
        Map<Long, BigDecimal> spendingPerCategory = transactions.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getCategory().getId(),
                        Collectors.mapping(Transaction::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        for (Budget budget : budgets) {
            BigDecimal spent = spendingPerCategory.getOrDefault(budget.getCategory().getId(), BigDecimal.ZERO);
            BigDecimal budgeted = budget.getAmount();

            if (budgeted.compareTo(BigDecimal.ZERO) == 0) continue;

            BigDecimal percentage = spent.divide(budgeted, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));

            // Check for thresholds (e.g., 100%, 90%, 75%)
            checkAndNotifyForThreshold(user, budget, spent, percentage, 100);
            checkAndNotifyForThreshold(user, budget, spent, percentage, 90);
            checkAndNotifyForThreshold(user, budget, spent, percentage, 75);
        }
    }

    private void checkAndNotifyForThreshold(User user, Budget budget, BigDecimal spent, BigDecimal percentage, int threshold) {
        if (percentage.doubleValue() >= threshold) {
            String message = String.format("You have spent %.2f%% of your '%s' budget for this month.",
                    percentage, budget.getCategory().getName());

            // IMPORTANT: Check if this exact notification has been sent before to avoid spam
            if (!notificationRepository.existsByUserIdAndMessage(user.getId(), message)) {
                Notification notification = new Notification();
                notification.setUser(user);
                notification.setMessage(message);
                notification.setType(NotificationType.BUDGET_THRESHOLD);
                notificationRepository.save(notification);
                log.info("Created notification for user {}: {}", user.getEmail(), message);
            }
        }
    }
}