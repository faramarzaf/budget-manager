package com.example.budgetmanager.domain.transaction;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    List<Transaction> findAllByUserIdAndTransactionDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}