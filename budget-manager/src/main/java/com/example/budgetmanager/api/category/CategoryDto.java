package com.example.budgetmanager.api.category;

import com.example.budgetmanager.domain.category.CategoryType;

public record CategoryDto(
        Long id,
        String name,
        CategoryType type
) {
}
