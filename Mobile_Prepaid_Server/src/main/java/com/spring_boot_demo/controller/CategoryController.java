package com.spring_boot_demo.controller;

import com.spring_boot_demo.model.Category;
import com.spring_boot_demo.repository.RevokedTokenRepository;
import com.spring_boot_demo.repository.RoleRepository;
import com.spring_boot_demo.repository.UserRepository;
import com.spring_boot_demo.security.JwtUtil;
import com.spring_boot_demo.service.CategoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://127.0.0.1:5501")
public class CategoryController {
	
	  @Autowired
	    private JwtUtil jwtUtil;

	    @Autowired
	    private UserRepository userRepository;

	    @Autowired
	    private RevokedTokenRepository revokedTokenRepository;

	    @Autowired
	    private PasswordEncoder passwordEncoder;

	    @Autowired
	    private RoleRepository roleRepository;

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // Get all categories
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // Get category by ID
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Optional<Category> category = categoryService.getCategoryById(id);
        return category.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get category by name
    @GetMapping("/name/{name}")
    public ResponseEntity<Category> getCategoryByName(@PathVariable String name) {
        Optional<Category> category = categoryService.getCategoryByName(name);
        return category.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create a new category
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }

    // Update a category
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        return categoryService.updateCategory(id, category)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a category
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
