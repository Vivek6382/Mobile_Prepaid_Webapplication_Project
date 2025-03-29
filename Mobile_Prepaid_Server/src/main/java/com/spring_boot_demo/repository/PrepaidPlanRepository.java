package com.spring_boot_demo.repository;

import com.spring_boot_demo.model.PrepaidPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrepaidPlanRepository extends JpaRepository<PrepaidPlan, Long> {
    
    List<PrepaidPlan> findByCategories_CategoryName(String categoryName);
    
    Optional<PrepaidPlan> findById(Long planId);
    
    List<PrepaidPlan> findByIsActiveTrue();
    
    List<PrepaidPlan> findByIsActiveFalse();

    @Modifying
    @Query("UPDATE PrepaidPlan p SET p.isActive = false WHERE p.planId = :planId")
    void softDeleteById(Long planId);

    @Modifying
    @Query("UPDATE PrepaidPlan p SET p.isActive = false WHERE p.planId IN :planIds")
    void softDeleteMultipleByIds(List<Long> planIds);

    // Reactivate a single prepaid plan
    @Modifying
    @Query("UPDATE PrepaidPlan p SET p.isActive = true WHERE p.planId = :planId")
    void reactivateById(Long planId);

    // Bulk reactivate prepaid plans
    @Modifying
    @Query("UPDATE PrepaidPlan p SET p.isActive = true WHERE p.planId IN :planIds")
    void reactivateMultipleByIds(List<Long> planIds);

    
}
