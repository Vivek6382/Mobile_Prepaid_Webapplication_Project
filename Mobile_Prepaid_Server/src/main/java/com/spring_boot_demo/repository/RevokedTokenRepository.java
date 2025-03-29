package com.spring_boot_demo.repository;

import com.spring_boot_demo.model.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RevokedTokenRepository extends JpaRepository<RevokedToken, String> {
    Optional<RevokedToken> findByToken(String token);
    boolean existsByToken(String token); // ✅ Add this method
    
    
}
