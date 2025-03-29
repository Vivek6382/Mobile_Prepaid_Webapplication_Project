package com.spring_boot_demo.controller;

import com.spring_boot_demo.dto.BulkDeleteRequest;
import com.spring_boot_demo.model.PrepaidPlan;
import com.spring_boot_demo.repository.RevokedTokenRepository;
import com.spring_boot_demo.repository.RoleRepository;
import com.spring_boot_demo.repository.UserRepository;
import com.spring_boot_demo.security.JwtUtil;
import com.spring_boot_demo.service.PrepaidPlanService;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;


import com.fasterxml.jackson.annotation.JsonIgnore;

@RestController
@RequestMapping("/api/prepaid-plans")
@CrossOrigin(origins = "http://127.0.0.1:5501")
public class PrepaidPlanController {

    private final PrepaidPlanService prepaidPlanService;

    
    
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
    
    
    public PrepaidPlanController(PrepaidPlanService prepaidPlanService) {
        this.prepaidPlanService = prepaidPlanService;
    }

    // Get all prepaid plans
    @GetMapping
    public ResponseEntity<List<PrepaidPlan>> getAllPlans() {
        return ResponseEntity.ok(prepaidPlanService.getAllPlans());
    }

    // Get prepaid plan by ID
    @GetMapping("/{id}")
    public ResponseEntity<PrepaidPlan> getPlanById(@PathVariable Long id) {
        Optional<PrepaidPlan> plan = prepaidPlanService.getPlanById(id);
        return plan.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get prepaid plans by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<PrepaidPlan>> getPlansByCategory(@PathVariable String category) {
        return ResponseEntity.ok(prepaidPlanService.getPlansByCategory(category));
    }

    // Create a new prepaid plan
    @PostMapping
    public ResponseEntity<PrepaidPlan> createPlan(@RequestBody PrepaidPlan plan) {
        return ResponseEntity.ok(prepaidPlanService.createPlan(plan));
    }

    // Update a prepaid plan
    @Modifying
    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<PrepaidPlan> updatePlan(@PathVariable Long id, @RequestBody PrepaidPlan plan) {
        return prepaidPlanService.updatePlan(id, plan)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a prepaid plan
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        prepaidPlanService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
    
    
   
    
    // Delete multiple prepaid plans
    @DeleteMapping("/bulk-delete")
    public ResponseEntity<Void> deleteMultiplePlans(@RequestBody BulkDeleteRequest request) {
        if (request.getPlanIds() == null || request.getPlanIds().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        prepaidPlanService.deleteMultiplePlans(request.getPlanIds());
        return ResponseEntity.noContent().build();
    }


    
    
//    Soft-Delete
    
    
    // Get only active prepaid plans
    @GetMapping("/active")
    public ResponseEntity<List<PrepaidPlan>> getAllActivePlans() {
        return ResponseEntity.ok(prepaidPlanService.getAllActivePlans());
    }

    // Get only inactive prepaid plans
    @GetMapping("/inactive")
    public ResponseEntity<List<PrepaidPlan>> getAllInactivePlans() {
        return ResponseEntity.ok(prepaidPlanService.getAllInactivePlans());
    }

    
    // Soft delete a single prepaid plan
    @PatchMapping("/soft-delete/{id}")
    public ResponseEntity<Void> softDeletePlan(@PathVariable Long id) {
        prepaidPlanService.softDeletePlan(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/bulk-soft-delete")
    public ResponseEntity<Void> softDeleteMultiplePlans(@RequestBody Map<String, List<Long>> requestBody) {
        List<Long> planIds = requestBody.get("planIds");

        if (planIds == null || planIds.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        prepaidPlanService.softDeleteMultiplePlans(planIds);
        return ResponseEntity.noContent().build();
    }


    // Reactivate a single prepaid plan
    @PatchMapping("/reactivate/{id}")
    public ResponseEntity<Void> reactivatePlan(@PathVariable Long id) {
        prepaidPlanService.reactivatePlan(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/bulk-reactivate")
    public ResponseEntity<Void> reactivateMultiplePlans(@RequestBody Map<String, List<Long>> requestBody) {
        List<Long> planIds = requestBody.get("planIds");

        if (planIds == null || planIds.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        prepaidPlanService.reactivateMultiplePlans(planIds);
        return ResponseEntity.noContent().build();
    }

    
}
