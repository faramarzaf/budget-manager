package com.example.budgetmanager.api.budget;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/v1/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    public ResponseEntity<BudgetDto> setBudget(
            @Valid @RequestBody BudgetRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        BudgetDto savedBudget = budgetService.setBudget(request, userDetails.getUsername());
        return ResponseEntity.ok(savedBudget);
    }

    @GetMapping
    public ResponseEntity<List<BudgetDto>> getBudgets(
            @RequestParam(name = "year", required = false) Integer year,
            @RequestParam(name = "month", required = false) Integer month,
            @AuthenticationPrincipal UserDetails userDetails) {

        YearMonth yearMonth = YearMonth.now();
        int queryYear = year != null ? year : yearMonth.getYear();
        int queryMonth = month != null ? month : yearMonth.getMonthValue();

        List<BudgetDto> budgets = budgetService.getBudgetsForMonth(queryYear, queryMonth, userDetails.getUsername());
        return ResponseEntity.ok(budgets);
    }
}