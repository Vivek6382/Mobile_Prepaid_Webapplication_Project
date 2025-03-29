package com.spring_boot_demo.controller;

import com.spring_boot_demo.model.User;
import com.spring_boot_demo.service.UserService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }
    
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
    
    
    @PatchMapping("/{id}/email")
    public ResponseEntity<String> updateEmail(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String email = request.get("email"); // Extract email from JSON request body
        userService.updateEmail(id, email);
        return ResponseEntity.ok("Email updated successfully.");
    }


    
    // ✅ New API: Update Alternate Number, Email, Contact Method, Communication Language
    @PatchMapping("/{id}/update-details")
    public ResponseEntity<String> updateUserDetails(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String alternateNumber = request.get("alternateNumber");
        String email = request.get("email");
        String contactMethodStr = request.get("contactMethod");
        String communicationLanguageStr = request.get("communicationLanguage");

        userService.updateUserDetails(id, alternateNumber, email, contactMethodStr, communicationLanguageStr);
        return ResponseEntity.ok("User details updated successfully.");
    }
    
    
    
 // Add this to your UserController
    @PostMapping("/{id}/profile-picture-base64")
    public ResponseEntity<String> uploadProfilePictureBase64(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        try {
            String base64Image = request.get("image");
            if (base64Image == null || base64Image.isEmpty()) {
                return ResponseEntity.badRequest().body("No image data provided");
            }
            
            // Decode base64 to byte array
            byte[] imageBytes = java.util.Base64.getDecoder().decode(base64Image);
            
            // Validate content (simple check for image header)
            if (imageBytes.length < 4) {
                return ResponseEntity.badRequest().body("Invalid image data");
            }
            
            // Check file size (max 2MB)
            if (imageBytes.length > 2 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("File size exceeds maximum limit (2MB)");
            }
            
            userService.saveProfilePicture(id, imageBytes);
            return ResponseEntity.ok("Profile picture uploaded successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid Base64 format");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error uploading profile picture: " + e.getMessage());
        }
    }

    // Add this GET endpoint to retrieve the profile picture
    @GetMapping("/{id}/profile-picture")
    public ResponseEntity<?> getProfilePicture(@PathVariable Long id) {
        try {
            byte[] imageData = userService.getProfilePicture(id);
            if (imageData == null || imageData.length == 0) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG) // You can detect actual type if needed
                    .body(imageData);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving profile picture: " + e.getMessage());
        }
    }    
    
}
