package com.example.budgetmanager.api.transaction;

import com.example.budgetmanager.domain.category.CategoryType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionDto(
        Long id,
        Long categoryId,
        String categoryName,
        CategoryType categoryType,
        BigDecimal amount,
        String description,
        LocalDate transactionDate
) {
}