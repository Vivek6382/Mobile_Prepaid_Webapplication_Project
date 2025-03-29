package com.spring_boot_demo.service;

import com.spring_boot_demo.exception.BulkOperationException;
import com.spring_boot_demo.exception.InvalidPrepaidPlanException;
import com.spring_boot_demo.exception.PrepaidPlanAlreadyExistsException;
import com.spring_boot_demo.exception.PrepaidPlanNotFoundException;
import com.spring_boot_demo.model.Category;
import com.spring_boot_demo.model.PrepaidPlan;
import com.spring_boot_demo.repository.PrepaidPlanRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PrepaidPlanService {

    private final PrepaidPlanRepository prepaidPlanRepository;

    public PrepaidPlanService(PrepaidPlanRepository prepaidPlanRepository) {
        this.prepaidPlanRepository = prepaidPlanRepository;
    }
    
    
    // Validate prepaid plan before creating or updating
    private void validatePrepaidPlan(PrepaidPlan plan) {
        List<String> validationErrors = new ArrayList<>();

        // Validate plan name
        if (plan.getPlanName() == null || plan.getPlanName().trim().isEmpty()) {
            validationErrors.add("Plan name cannot be empty");
        }

        // Validate price
        if (plan.getPrice() == null || plan.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            validationErrors.add("Price must be a positive number");
        }

        // Validate validity
        if (plan.getValidity() <= 0) {
            validationErrors.add("Validity must be a positive number");
        }

        // If there are validation errors, throw exception
        if (!validationErrors.isEmpty()) {
            throw new InvalidPrepaidPlanException("Invalid prepaid plan details", validationErrors);
        }
    }
    
    

    // Get all prepaid plans
    public List<PrepaidPlan> getAllPlans() {
        return prepaidPlanRepository.findAll();
    }

    // Get prepaid plan by ID
    public Optional<PrepaidPlan> getPlanById(Long id) {
        return prepaidPlanRepository.findById(id);
    }

    // Get prepaid plans by category
    public List<PrepaidPlan> getPlansByCategory(String category) {
        return prepaidPlanRepository.findByCategories_CategoryName(category);
    }

    // Create a new prepaid plan
    public PrepaidPlan createPlan(PrepaidPlan plan) {
        // Validate the plan
        validatePrepaidPlan(plan);

        // Check for existing plan with the same name
        prepaidPlanRepository.findAll().stream()
            .filter(existingPlan -> existingPlan.getPlanName().equalsIgnoreCase(plan.getPlanName()))
            .findFirst()
            .ifPresent(existingPlan -> {
                throw new PrepaidPlanAlreadyExistsException(
                    plan.getPlanName(), 
                    "A plan with this name already exists."
                );
            });

        return prepaidPlanRepository.save(plan);
    }


    @Transactional
    public Optional<PrepaidPlan> updatePlan(Long id, PrepaidPlan plan) {
        // Validate the plan
        validatePrepaidPlan(plan);

        return prepaidPlanRepository.findById(id).map(existingPlan -> {
            // Check if the new name conflicts with another existing plan
            prepaidPlanRepository.findAll().stream()
                .filter(p -> p.getPlanName().equalsIgnoreCase(plan.getPlanName()) && !p.getPlanId().equals(id))
                .findFirst()
                .ifPresent(p -> {
                    throw new PrepaidPlanAlreadyExistsException(
                        plan.getPlanName(), "A different plan with this name already exists."
                    );
                });

            // Update plan details
            existingPlan.setPlanName(plan.getPlanName());
            existingPlan.setPrice(plan.getPrice());
            existingPlan.setValidity(plan.getValidity());
            existingPlan.setDailyData(plan.getDailyData());
            existingPlan.setTotalData(plan.getTotalData());
            existingPlan.setVoice(plan.getVoice());
            existingPlan.setSms(plan.getSms());
            existingPlan.setOtt(plan.getOtt());
            existingPlan.setTerms(plan.getTerms());
            existingPlan.setCategories(plan.getCategories());

            // Save and return wrapped in Optional
            return Optional.of(prepaidPlanRepository.saveAndFlush(existingPlan));
        }).orElseThrow(() -> new PrepaidPlanNotFoundException(id));
    }

    

    // Delete a prepaid plan
    @Transactional
    public void deletePlan(Long id) {
        PrepaidPlan plan = prepaidPlanRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Plan not found"));

        // Remove associations to avoid orphaned references
        for (Category category : plan.getCategories()) {
            category.getPrepaidPlans().remove(plan);
        }
        plan.getCategories().clear();  // Remove all associations

        prepaidPlanRepository.delete(plan);
    }

    
    @Transactional
    public void deleteMultiplePlans(List<Long> planIds) {
        List<PrepaidPlan> plans = prepaidPlanRepository.findAllById(planIds);

        if (plans.isEmpty()) {
            throw new EntityNotFoundException("No plans found with the given IDs");
        }

        for (PrepaidPlan plan : plans) {
            for (Category category : plan.getCategories()) {
                category.getPrepaidPlans().remove(plan);
            }
            plan.getCategories().clear(); // Remove all associations
        }

        prepaidPlanRepository.deleteAll(plans); // Delete all plans in bulk
    }


    
    public Optional<PrepaidPlan> findById(Long planId) {
        return prepaidPlanRepository.findById(planId);
    }

    
    
//    {
//        "planIds": [1, 2, 3, 5]
//    }
    
    
    
    
    //    Soft -Delete
    
    
    // Get only active prepaid plans
    public List<PrepaidPlan> getAllActivePlans() {
        return prepaidPlanRepository.findByIsActiveTrue();
    }

    
    // Get only inactive prepaid plans
    public List<PrepaidPlan> getAllInactivePlans() {
        return prepaidPlanRepository.findByIsActiveFalse();
    }

    
    // Soft delete a single prepaid plan
    @Transactional
    public void softDeletePlan(Long planId) {
        PrepaidPlan plan = prepaidPlanRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        plan.setActive(false);
        prepaidPlanRepository.save(plan);
    }

    
    // Bulk soft delete prepaid plans
    // Soft delete multiple plans with detailed error handling
    @Transactional
    public void softDeleteMultiplePlans(List<Long> planIds) {
        List<String> failedOperations = new ArrayList<>();

        // Find existing plans
        List<PrepaidPlan> existingPlans = prepaidPlanRepository.findAllById(planIds);
        
        // Track which IDs were actually found
        List<Long> foundPlanIds = existingPlans.stream()
            .map(PrepaidPlan::getPlanId)
            .collect(Collectors.toList());

        // Check for any IDs not found
        List<Long> notFoundIds = planIds.stream()
            .filter(id -> !foundPlanIds.contains(id))
            .collect(Collectors.toList());

        // Add not found IDs to failed operations
        notFoundIds.forEach(id -> 
            failedOperations.add("Plan with ID " + id + " not found")
        );

        // Perform soft delete on existing plans
        existingPlans.forEach(plan -> {
            try {
                plan.setActive(false);
                prepaidPlanRepository.save(plan);
            } catch (Exception e) {
                failedOperations.add("Failed to soft delete plan with ID " + plan.getPlanId() + ": " + e.getMessage());
            }
        });

        // If any operations failed, throw a bulk operation exception
        if (!failedOperations.isEmpty()) {
            throw new BulkOperationException("Some plans could not be soft deleted", failedOperations);
        }
    }
    
    

    // Reactivate a single prepaid plan
    @Transactional
    public void reactivatePlan(Long planId) {
        PrepaidPlan plan = prepaidPlanRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        plan.setActive(true);
        prepaidPlanRepository.save(plan);
    }

 // Bulk reactivate prepaid plans
    @Transactional
    public void reactivateMultiplePlans(List<Long> planIds) {
        List<PrepaidPlan> plans = prepaidPlanRepository.findAllById(planIds);
        if (plans.isEmpty()) {
            throw new EntityNotFoundException("No plans found with the given IDs");
        }
        prepaidPlanRepository.reactivateMultipleByIds(planIds); // Corrected method call
    }

    
}
