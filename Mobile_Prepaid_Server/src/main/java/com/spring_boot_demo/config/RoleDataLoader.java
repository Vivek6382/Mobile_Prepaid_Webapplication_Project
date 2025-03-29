package com.spring_boot_demo.config;

import com.spring_boot_demo.model.Role;
import com.spring_boot_demo.model.RoleName;
import com.spring_boot_demo.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Component
public class RoleDataLoader implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    @Transactional  // Ensure transaction handling
    public void run(String... args) throws Exception {
        System.out.println("RoleDataLoader started...");  // Debugging log

        if (roleRepository.count() == 0) {
            System.out.println("Inserting default roles...");

            Role userRole = new Role(null, RoleName.ROLE_USER, new HashSet<>());
            Role adminRole = new Role(null, RoleName.ROLE_ADMIN, new HashSet<>());
            Role guestRole = new Role(null, RoleName.ROLE_GUEST, new HashSet<>());

            roleRepository.save(userRole);
            roleRepository.save(adminRole);
            roleRepository.save(guestRole);

            System.out.println("Default roles inserted successfully.");
        } else {
            System.out.println("Roles already exist.");
        }
    }
}
