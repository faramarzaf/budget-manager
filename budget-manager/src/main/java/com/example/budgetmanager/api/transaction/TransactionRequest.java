package com.example.budgetmanager.api.transaction;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
        @NotNull Long categoryId,
        @NotNull @Positive BigDecimal amount,
        String description,
        @NotNull @PastOrPresent(message = "Transaction date cannot be in the future.") LocalDate transactionDate
) {}