package com.example.budgetmanager.api.category;


import com.example.budgetmanager.domain.category.CategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank @Size(min = 2, max = 50) String name,
        @NotNull CategoryType type
) {
}
