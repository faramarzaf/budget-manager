package com.example.budgetmanager.domain.budget;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Optional<Budget> findByUserIdAndCategoryIdAndMonth(Long userId, Long categoryId, LocalDate month);

    List<Budget> findAllByUserIdAndMonth(Long userId, LocalDate month);
}