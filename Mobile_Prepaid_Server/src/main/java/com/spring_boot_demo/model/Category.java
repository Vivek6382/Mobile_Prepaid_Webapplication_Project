package com.spring_boot_demo.model;

import jakarta.persistence.*;
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


    @Column(name = "category_name", unique = true, nullable = false)
    private String categoryName;

    @ManyToMany(mappedBy = "categories") // Bidirectional relationship
    @JsonIgnore
    private Set<PrepaidPlan> prepaidPlans;
}