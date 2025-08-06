package com.example.budgetmanager.api.budget;

import com.example.budgetmanager.domain.budget.Budget;
import com.example.budgetmanager.domain.budget.BudgetRepository;
import com.example.budgetmanager.domain.category.Category;
import com.example.budgetmanager.domain.category.CategoryRepository;
import com.example.budgetmanager.domain.category.CategoryType;
import com.example.budgetmanager.domain.user.User;
import com.example.budgetmanager.domain.user.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public BudgetService(BudgetRepository budgetRepository, CategoryRepository categoryRepository, UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BudgetDto setBudget(BudgetRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);
        Category category = categoryRepository.findByIdAndUserId(request.categoryId(), user.getId())
                .orElseThrow(() -> new AccessDeniedException("Category not found or you do not have permission."));

        if (category.getType() != CategoryType.EXPENSE) {
            throw new IllegalArgumentException("Budgets can only be set for EXPENSE categories.");
        }

        LocalDate month = LocalDate.of(request.year(), request.month(), 1);

        // "Upsert" logic: find existing or create new
        Budget budget = budgetRepository.findByUserIdAndCategoryIdAndMonth(user.getId(), category.getId(), month)
                .orElse(new Budget());

        budget.setUser(user);
        budget.setCategory(category);
        budget.setAmount(request.amount());
        budget.setMonth(month);

        Budget savedBudget = budgetRepository.save(budget);
        return toDto(savedBudget);
    }

    @Transactional(readOnly = true)
    public List<BudgetDto> getBudgetsForMonth(int year, int month, String userEmail) {
        User user = getUserByEmail(userEmail);
        LocalDate monthDate = LocalDate.of(year, month, 1);
        return budgetRepository.findAllByUserIdAndMonth(user.getId(), monthDate)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found."));
    }

    private BudgetDto toDto(Budget budget) {
        return new BudgetDto(
                budget.getId(),
                budget.getCategory().getId(),
                budget.getCategory().getName(),
                budget.getAmount(),
                budget.getMonth()
        );
    }
}