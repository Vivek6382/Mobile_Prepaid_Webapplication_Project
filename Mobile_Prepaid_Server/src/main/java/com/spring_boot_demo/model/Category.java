package com.spring_boot_demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @NotBlank(message = "Category name cannot be empty")
    @Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters")
    @Column(name = "category_name", unique = true, nullable = false)
    private String categoryName;

    @ManyToMany(mappedBy = "categories") // Bidirectional relationship
    @JsonIgnore
    private Set<PrepaidPlan> prepaidPlans;
}