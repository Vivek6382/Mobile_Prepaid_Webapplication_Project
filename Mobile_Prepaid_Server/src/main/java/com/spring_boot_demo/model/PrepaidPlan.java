package com.spring_boot_demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "mobile_prepaid_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "categories") // Prevent circular reference issue
public class PrepaidPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long planId;

    @Column(name = "plan_name", unique = true, nullable = false)
    private String planName;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private int validity; // in days

    @Column(nullable = true)
    private String dailyData;

    @Column(nullable = true)
    private String totalData;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String voice;

    @Column(nullable = true)
    private String sms;

    @ElementCollection
    @CollectionTable(name = "plan_ott", joinColumns = @JoinColumn(name = "plan_id"))
    private List<String> ott;

    @ElementCollection
    @CollectionTable(name = "plan_terms", joinColumns = @JoinColumn(name = "plan_id"))
    private List<String> terms;
    
    // Many-to-Many with Category
    @ManyToMany(cascade = CascadeType.REMOVE)  // Ensures removal of associations
    @JoinTable(
        name = "plan_categories",
        joinColumns = @JoinColumn(name = "plan_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories;

    // Soft delete field
    @Column(nullable = false)
    private boolean isActive = true; // Default to active
}
