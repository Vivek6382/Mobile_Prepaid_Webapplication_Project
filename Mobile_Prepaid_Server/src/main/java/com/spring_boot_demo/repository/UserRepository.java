package com.spring_boot_demo.repository;

import com.spring_boot_demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);  // ✅ Add this method

	Optional<User> findByEmail(String email);

	Optional<User> findByMobile(String mobile);
	
}
