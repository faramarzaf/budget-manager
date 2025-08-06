package com.example.budgetmanager.api.category;

import com.example.budgetmanager.domain.category.Category;
import com.example.budgetmanager.domain.category.CategoryRepository;
import com.example.budgetmanager.domain.user.User;
import com.example.budgetmanager.domain.user.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CategoryDto create(CategoryRequest request, String userEmail) {
        User user = getUserByEmail(userEmail);

        if (categoryRepository.existsByNameAndUserId(request.name(), user.getId())) {
            throw new IllegalStateException("Category with this name already exists.");
        }

        Category category = new Category();
        category.setName(request.name());
        category.setType(request.type());
        category.setUser(user);

        Category savedCategory = categoryRepository.save(category);
        return toDto(savedCategory);
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getCategoriesForUser(String userEmail) {
        User user = getUserByEmail(userEmail);
        return categoryRepository.findAllByUserId(user.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id, String userEmail) {
        User user = getUserByEmail(userEmail);
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Category not found"));

        // CRITICAL: Ensure the user owns this category before deleting
        if (!category.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this category.");
        }
        categoryRepository.delete(category);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found."));
    }

    private CategoryDto toDto(Category category) {
        return new CategoryDto(category.getId(), category.getName(), category.getType());
    }
}