package com.example.budgetmanager.api.category;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    /*
    Note on @AuthenticationPrincipal:
    This powerful annotation tells Spring Security to inject the details of the currently
     logged-in user directly into our method. This is how we securely get the user's email.
     */

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        CategoryDto createdCategory = categoryService.create(request, userDetails.getUsername());
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getUserCategories(@AuthenticationPrincipal UserDetails userDetails) {
        List<CategoryDto> categories = categoryService.getCategoriesForUser(userDetails.getUsername());
        return ResponseEntity.ok(categories);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        categoryService.delete(id, userDetails.getUsername());
    }
}