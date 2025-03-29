package com.spring_boot_demo.model;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonIgnoreProperties("users")  // Ignore users while serializing Role
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roleId;

    @Enumerated(EnumType.STRING)  // Store role name as an ENUM
    @Column(nullable = false, unique = true)
    private RoleName roleName;

    @OneToMany(mappedBy = "role")
    private Set<User> users = new HashSet<>();
}
