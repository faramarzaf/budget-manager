package com.example.budgetmanager.api.budget;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record BudgetRequest(
        @NotNull Long categoryId,
        @NotNull @Positive BigDecimal amount,
        @NotNull Integer year,
        @NotNull Integer month
) {
}