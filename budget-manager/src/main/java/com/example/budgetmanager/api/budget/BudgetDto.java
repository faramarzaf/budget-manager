package com.example.budgetmanager.api.budget;

import java.math.BigDecimal;
import java.time.LocalDate;

public record BudgetDto(
        Long id,
        Long categoryId,
        String categoryName,
        BigDecimal amount,
        LocalDate month
) {
}