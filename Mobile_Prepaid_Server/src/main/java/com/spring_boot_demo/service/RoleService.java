package com.spring_boot_demo.service;

import com.spring_boot_demo.model.Role;
import com.spring_boot_demo.model.RoleName;
import com.spring_boot_demo.repository.RoleRepository;
import com.spring_boot_demo.exception.RoleNotFoundException;
import com.spring_boot_demo.exception.InvalidRoleException;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public Optional<Role> getRoleByName(String roleName) {
        try {
            // Validate input
            if (roleName == null || roleName.trim().isEmpty()) {
                throw new InvalidRoleException("Role name cannot be null or empty");
            }

            // Convert string to RoleName enum
            RoleName roleEnum = RoleName.valueOf(roleName.toUpperCase());

            // Find role or throw exception if not found
            return Optional.ofNullable(roleRepository.findByRoleName(roleEnum)
                .orElseThrow(() -> new RoleNotFoundException(roleName, "No such role exists in the system.")));

        } catch (IllegalArgumentException e) {
            // Handle invalid enum conversion
            String validRoles = Arrays.stream(RoleName.values())
                .map(RoleName::name)
                .collect(Collectors.joining(", "));
            
            throw new InvalidRoleException("Invalid role name: " + roleName + ". Must be one of: " + validRoles);
        }
    }

    // Additional method to find by ID with exception handling
    public Role getRoleById(Long roleId) {
        if (roleId == null || roleId <= 0) {
            throw new InvalidRoleException("Invalid role ID: " + roleId);
        }

        return roleRepository.findById(roleId)
            .orElseThrow(() -> new RoleNotFoundException("Role with ID " + roleId + " not found"));
    }
}