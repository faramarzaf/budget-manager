package com.example.budgetmanager.api.transaction;

import com.example.budgetmanager.domain.budget.Budget;
import com.example.budgetmanager.domain.budget.BudgetRepository;
import com.example.budgetmanager.domain.category.Category;
import com.example.budgetmanager.domain.category.CategoryRepository;
import com.example.budgetmanager.domain.category.CategoryType;
import com.example.budgetmanager.domain.transaction.Transaction;
import com.example.budgetmanager.domain.transaction.TransactionRepository;
import com.example.budgetmanager.domain.user.User;
import com.example.budgetmanager.domain.user.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    private final BudgetRepository budgetRepository;

    public TransactionService(TransactionRepository transactionRepository, CategoryRepository categoryRepository, UserRepository userRepository, BudgetRepository budgetRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.budgetRepository = budgetRepository;
    }

    @Transactional
    public TransactionDto create(TransactionRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Category category = categoryRepository.findByIdAndUserId(request.categoryId(), user.getId())
                .orElseThrow(() -> new AccessDeniedException("Category not found or you do not have permission."));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setCategory(category);
        transaction.setAmount(request.amount());
        transaction.setDescription(request.description());
        transaction.setTransactionDate(request.transactionDate());

        Transaction savedTransaction = transactionRepository.save(transaction);
        return toDto(savedTransaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionDto> getTransactionsForUser(int year, int month, String userEmail) {
        User user = getUserByEmail(userEmail);
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        return transactionRepository.findAllByUserIdAndTransactionDateBetween(user.getId(), startDate, endDate)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Transaction transaction = transactionRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new AccessDeniedException("Transaction not found or you do not have permission."));

        transactionRepository.delete(transaction);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found."));
    }


    @Transactional(readOnly = true)
    public DashboardDto getDashboardSummary(int year, int month, String userEmail) {
        User user = getUserByEmail(userEmail);
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        // 1. Fetch all necessary data in one go
        List<Transaction> transactions = transactionRepository.findAllByUserIdAndTransactionDateBetween(user.getId(), startDate, endDate);
        List<Budget> budgets = budgetRepository.findAllByUserIdAndMonth(user.getId(), startDate);

        // 2. Calculate Total Income and Expense
        BigDecimal totalIncome = transactions.stream()
                .filter(t -> t.getCategory().getType() == CategoryType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = transactions.stream()
                .filter(t -> t.getCategory().getType() == CategoryType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netBalance = totalIncome.subtract(totalExpense);

        // 3. Calculate Spending per Category
        Map<String, BigDecimal> spendingMap = transactions.stream()
                .filter(t -> t.getCategory().getType() == CategoryType.EXPENSE)
                .collect(Collectors.groupingBy(
                        t -> t.getCategory().getName(),
                        Collectors.mapping(Transaction::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        List<DashboardDto.CategorySpending> spendingByCategory = spendingMap.entrySet().stream()
                .map(entry -> new DashboardDto.CategorySpending(entry.getKey(), entry.getValue()))
                .toList();

        // 4. Calculate Budget Status
        List<DashboardDto.BudgetStatus> budgetStatus = budgets.stream()
                .map(budget -> {
                    BigDecimal spent = spendingMap.getOrDefault(budget.getCategory().getName(), BigDecimal.ZERO);
                    BigDecimal remaining = budget.getAmount().subtract(spent);
                    return new DashboardDto.BudgetStatus(
                            budget.getCategory().getName(),
                            budget.getAmount(),
                            spent,
                            remaining
                    );
                })
                .toList();

        return new DashboardDto(totalIncome, totalExpense, netBalance, spendingByCategory, budgetStatus);
    }


    private TransactionDto toDto(Transaction transaction) {
        return new TransactionDto(
                transaction.getId(),
                transaction.getCategory().getId(),
                transaction.getCategory().getName(),
                transaction.getCategory().getType(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getTransactionDate()
        );
    }
}