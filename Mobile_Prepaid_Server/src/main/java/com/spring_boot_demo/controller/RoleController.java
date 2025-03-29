package com.spring_boot_demo.controller;

import com.spring_boot_demo.model.Role;
import com.spring_boot_demo.service.RoleService;
import com.spring_boot_demo.dto.ApiResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping("/{roleName}")
    public ResponseEntity<ApiResponse<Role>> getRoleByName(@PathVariable String roleName) {
        Optional<Role> role = roleService.getRoleByName(roleName);
        
        // Unwrap the Optional
        return ResponseEntity.ok(
            ApiResponse.success("Role retrieved successfully", role.get())
        );
    }

    // Optional: Add endpoint to get role by ID
    @GetMapping("/id/{roleId}")
    public ResponseEntity<ApiResponse<Role>> getRoleById(@PathVariable Long roleId) {
        Role role = roleService.getRoleById(roleId);
        
        return ResponseEntity.ok(
            ApiResponse.success("Role retrieved successfully", role)
        );
    }
}