package com.example.budgetmanager.api.transaction;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<TransactionDto> createTransaction(
            @Valid @RequestBody TransactionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        TransactionDto createdTransaction = transactionService.create(request, userDetails.getUsername());
        return new ResponseEntity<>(createdTransaction, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<TransactionDto>> getUserTransactions(
            @RequestParam(name = "year", required = false) Integer year,
            @RequestParam(name = "month", required = false) Integer month,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Default to the current year and month if not provided
        YearMonth yearMonth = YearMonth.now();
        int queryYear = year != null ? year : yearMonth.getYear();
        int queryMonth = month != null ? month : yearMonth.getMonthValue();

        List<TransactionDto> transactions = transactionService.getTransactionsForUser(queryYear, queryMonth, userDetails.getUsername());
        return ResponseEntity.ok(transactions);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTransaction(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        transactionService.delete(id, userDetails.getUsername());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDto> getDashboard(
            @RequestParam(name = "year", required = false) Integer year,
            @RequestParam(name = "month", required = false) Integer month,
            @AuthenticationPrincipal UserDetails userDetails) {

        YearMonth yearMonth = YearMonth.now();
        int queryYear = year != null ? year : yearMonth.getYear();
        int queryMonth = month != null ? month : yearMonth.getMonthValue();
        DashboardDto dashboardData = transactionService.getDashboardSummary(queryYear, queryMonth, userDetails.getUsername());
        return ResponseEntity.ok(dashboardData);
    }
}