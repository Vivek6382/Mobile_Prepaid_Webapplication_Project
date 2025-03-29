package com.spring_boot_demo.controller;

import com.spring_boot_demo.model.UserCommunicationLanguage;
import com.spring_boot_demo.model.UserContactMethod;
import com.spring_boot_demo.model.RevokedToken;
import com.spring_boot_demo.model.Role;
import com.spring_boot_demo.model.RoleName;
import com.spring_boot_demo.model.User;
import com.spring_boot_demo.repository.RevokedTokenRepository;
import com.spring_boot_demo.repository.RoleRepository;
import com.spring_boot_demo.repository.UserRepository;
import com.spring_boot_demo.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://127.0.0.1:5501")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RevokedTokenRepository revokedTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    
//     POST : http://localhost:8083/auth/register
    
//    {
//        "name": "John Doe",
//        "username": "johndoe",
//        "email": "johndoe@example.com",
//        "password": "password123",
//        "mobile": "9876543210",
//        "alternateNumber": "9876504321",
//        "dob": "1995-08-15",
//        "address": "123 Street, City",
//        "communicationLanguage": "ENGLISH",
//        "contactMethod": "EMAIL",
//        "roleId": 2
//    }
    

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Map<String, Object> payload) {
        try {
            String username = (String) payload.get("username");
            String password = (String) payload.get("password");
            String name = (String) payload.get("name");
            String dob = (String) payload.get("dob");
            String email = (String) payload.get("email");
            String mobile = (String) payload.get("mobile");
            String alternateNumber = (String) payload.get("alternateNumber");
            String contactMethodStr = (String) payload.get("contactMethod");
            String communicationLanguageStr = (String) payload.get("communicationLanguage");
            String address = (String) payload.get("address");
            Boolean isActive = (Boolean) payload.getOrDefault("isActive", true);
            String roleNameStr = (String) payload.get("role");

            // Check if username or email already exists
            if (userRepository.findByUsername(username).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists!");
            }
            if (userRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists!");
            }

            // Create User Object
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setName(name);
            user.setDob(dob);
            user.setEmail(email);
            user.setMobile(mobile);
            user.setAlternateNumber(alternateNumber);
            user.setAddress(address);
            user.setIsActive(isActive);

            // Assign Enums (Ensure they match ENUM values in the database)
            try {
                user.setContactMethod(UserContactMethod.valueOf(contactMethodStr.toUpperCase()));
                user.setCommunicationLanguage(UserCommunicationLanguage.valueOf(communicationLanguageStr.toUpperCase()));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid contact method or communication language.");
            }

            // Assign Role (Ensure role_id is correctly stored)
            RoleName roleName = (roleNameStr != null) ? RoleName.valueOf(roleNameStr.toUpperCase()) : RoleName.ROLE_GUEST;
            Role role = roleRepository.findByRoleName(roleName)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
            user.setRole(role); // This will automatically map to `role_id`

            // Save the user
            userRepository.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error registering user: " + e.getMessage());
        }
    }


    
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String mobile = payload.get("mobile");
        String username = payload.get("username");
        String password = payload.get("password");

        Optional<User> existingUser;
        
        if (mobile != null && !mobile.isEmpty()) {
            existingUser = userRepository.findByMobile(mobile);
        } else if (username != null && !username.isEmpty() && password != null) {
            existingUser = userRepository.findByUsername(username);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("❌ Mobile or Username & Password required.");
        }

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            if (username != null && password != null) {
                // Verify password if logging in with username
                if (!passwordEncoder.matches(password, user.getPassword())) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid credentials.");
                }
            }

            // Generate JWT token
            String accessToken = jwtUtil.generateToken(user.getUserId(), user.getMobile(), user.getRole().getRoleName().name());
            String refreshToken = jwtUtil.generateRefreshToken(user.getMobile());

            return ResponseEntity.ok(Map.of(
                "name", user.getName(),
                "email", user.getEmail(),
                "mobile", user.getMobile(),
                "username", user.getUsername(),
                "role", user.getRole().getRoleName().name(),
                "accessToken", accessToken,
                "refreshToken", refreshToken
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid credentials.");
    }
    

    
    
    

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String token) {
        // Extract token from "Bearer <TOKEN>"
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);  // Remove "Bearer "
        }

        String username = jwtUtil.getUsernameFromToken(token);
        Optional<User> user = userRepository.findByMobile(username);

        if (user.isPresent()) {
            User u = user.get();
            return ResponseEntity.ok(Map.ofEntries(
                Map.entry("userId", u.getUserId()),
                Map.entry("username", u.getUsername()),
                Map.entry("name", u.getName()),
                Map.entry("dob", u.getDob()),
                Map.entry("email", u.getEmail()),
                Map.entry("mobile", u.getMobile()),
                Map.entry("alternateNumber", u.getAlternateNumber()),
                Map.entry("contactMethod", u.getContactMethod().name()),
                Map.entry("communicationLanguage", u.getCommunicationLanguage().name()),
                Map.entry("address", u.getAddress()),
                Map.entry("role", u.getRole().getRoleName().name())
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }


    
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestHeader("Authorization") String accessTokenHeader, 
            @RequestBody Map<String, String> payload
    ) {
        // Extract tokens
        String accessToken = extractTokenFromHeader(accessTokenHeader);
        String refreshToken = payload.get("refreshToken");

        // Validate and revoke access token
        if (accessToken != null) {
            revokedTokenRepository.save(new RevokedToken(accessToken));
        }

        // Validate and revoke refresh token
        if (refreshToken != null) {
            revokedTokenRepository.save(new RevokedToken(refreshToken));
        }

        // Return success response
        return ResponseEntity.ok(Map.of(
            "message", "Logout successful",
            "accessTokenRevoked", accessToken != null,
            "refreshTokenRevoked", refreshToken != null
        ));
    }

    // Helper method to extract token from Authorization header
    private String extractTokenFromHeader(String header) {
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
    
    
    
    
}
