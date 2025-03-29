package com.spring_boot_demo.service;

import com.spring_boot_demo.exception.CategoryNotFoundException;
import com.spring_boot_demo.exception.DuplicateResourceException;
import com.spring_boot_demo.model.Category;
import com.spring_boot_demo.model.PrepaidPlan;
import com.spring_boot_demo.repository.CategoryRepository;
import com.spring_boot_demo.repository.PrepaidPlanRepository;

import jakarta.transaction.Transactional;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final PrepaidPlanRepository prepaidPlanRepository;

    public CategoryService(CategoryRepository categoryRepository, PrepaidPlanRepository prepaidPlanRepository) {
        this.categoryRepository = categoryRepository;
        this.prepaidPlanRepository = prepaidPlanRepository;
    }

    // Get all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get category by ID
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // Get category by name
    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByCategoryName(name);
    }

    // Check if category exists by ID
    public boolean existsById(Long id) {
        return categoryRepository.existsById(id);
    }

    // Check if category exists by name
    public boolean existsByName(String name) {
        return categoryRepository.findByCategoryName(name).isPresent();
    }

    // Create a new category
    public Category createCategory(Category category) {
        // Check if category with the same name already exists
        if (existsByName(category.getCategoryName())) {
            throw new DuplicateResourceException("Category", "name", category.getCategoryName());
        }
        
        try {
            return categoryRepository.save(category);
        } catch (DataIntegrityViolationException e) {
            throw new DuplicateResourceException("Category creation failed due to constraint violation: " + e.getMessage());
        }
    }

 // Update an existing category
    public Optional<Category> updateCategory(Long id, Category category) {
        if (!categoryRepository.existsById(id)) {
            return Optional.empty();
        }
        
        // Check if another category with the same name already exists
        Optional<Category> categoryWithSameName = categoryRepository.findByCategoryName(category.getCategoryName());
        if (categoryWithSameName.isPresent() && !categoryWithSameName.get().getCategoryId().equals(id)) {
            throw new DuplicateResourceException("Category", "name", category.getCategoryName());
        }
        
        return categoryRepository.findById(id).map(existingCategory -> {
            existingCategory.setCategoryName(category.getCategoryName());
            try {
                return categoryRepository.save(existingCategory);
            } catch (DataIntegrityViolationException e) {
                throw new DuplicateResourceException("Category update failed due to constraint violation: " + e.getMessage());
            }
        });
    }
    

 // Delete a category
    @Transactional
    public void deleteCategory(Long id) {
        // Use orElseThrow to get the Category or throw an exception if not found
        Category category = getCategoryById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));

        // Get all prepaid plans associated with this category
        Set<PrepaidPlan> associatedPlans = category.getPrepaidPlans();

        // Remove each associated plan first
        for (PrepaidPlan plan : associatedPlans) {
            prepaidPlanRepository.delete(plan);
        }

        // Now remove the category itself
        categoryRepository.delete(category);
    }
}