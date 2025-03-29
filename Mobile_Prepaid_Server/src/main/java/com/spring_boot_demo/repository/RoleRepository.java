package com.spring_boot_demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.spring_boot_demo.model.Role;
import com.spring_boot_demo.model.RoleName;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(RoleName roleName);
}
