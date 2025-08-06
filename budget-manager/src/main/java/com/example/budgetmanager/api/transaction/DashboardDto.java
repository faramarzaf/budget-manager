package com.example.budgetmanager.api.transaction;

import java.math.BigDecimal;
import java.util.List;

public record DashboardDto(
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal netBalance,
        List<CategorySpending> spendingByCategory,
        List<BudgetStatus> budgetStatus
) {
    public record CategorySpending(String categoryName, BigDecimal total) {
    }

    public record BudgetStatus(String categoryName, BigDecimal budgeted, BigDecimal spent, BigDecimal remaining) {
    }
}