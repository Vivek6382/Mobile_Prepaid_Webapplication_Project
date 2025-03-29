package com.spring_boot_demo.repository;

import com.spring_boot_demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface CustomerFilterRepository extends JpaRepository<User, Long> {
    
    @Query("SELECT u FROM User u JOIN u.role r WHERE r.roleName = 'ROLE_GUEST' OR r.roleName = 'ROLE_USER'")
    List<User> findAllCustomers();
    
    // Simplified query that's less likely to cause errors
    @Query("SELECT DISTINCT u FROM User u JOIN u.role r WHERE (r.roleName = 'ROLE_GUEST' OR r.roleName = 'ROLE_USER')")
    List<User> findAllCustomersSimple();
}