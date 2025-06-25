package com.spring_boot_demo.service;

import com.spring_boot_demo.model.User;
import com.spring_boot_demo.model.UserCommunicationLanguage;
import com.spring_boot_demo.model.UserContactMethod;
import com.spring_boot_demo.repository.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;


@Service
public class UserService {
    private final UserRepository userRepository;
    
    @Autowired
    private EntityManager entityManager;
    
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public User saveUser(User user) {
        return userRepository.save(user);
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> findById(Long userId) {
        return userRepository.findById(userId);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    
    public void updateEmail(Long id, String email) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setEmail(email); // Update email
        userRepository.save(user);
    }


    
 // ✅ New Method: Update Alternate Number, Email, Contact Method, Communication Language
    public void updateUserDetails(Long id, String alternateNumber, String email, String contactMethodStr, String communicationLanguageStr) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (alternateNumber != null) {
            user.setAlternateNumber(alternateNumber);
        }
        if (email != null) {
            user.setEmail(email);
        }
        if (contactMethodStr != null) {
            try {
                user.setContactMethod(UserContactMethod.valueOf(contactMethodStr.toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid contact method. Allowed values: EMAIL, SMS.");
            }
        }
        if (communicationLanguageStr != null) {
            try {
                user.setCommunicationLanguage(UserCommunicationLanguage.valueOf(communicationLanguageStr.toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid communication language.");
            }
        }

        userRepository.save(user);
    }
    
    
    
 // Add this method to your UserService class
	/*
	 * @Transactional public void saveProfilePicture(Long id, byte[] imageBytes) {
	 * try { User user = userRepository.findById(id) .orElseThrow(() -> new
	 * RuntimeException("User not found"));
	 * 
	 * System.out.println("Image size: " + imageBytes.length + " bytes");
	 * 
	 * // Clear Hibernate session to avoid issues with large objects
	 * entityManager.flush(); entityManager.clear();
	 * 
	 * // Set the profile picture user.setProfilePicture(imageBytes);
	 * 
	 * // Save with a fresh transaction userRepository.saveAndFlush(user);
	 * 
	 * System.out.println("Successfully saved profile picture for user ID: " + id);
	 * } catch (Exception e) { System.err.println("Error in saveProfilePicture: " +
	 * e.getMessage()); e.printStackTrace(); throw e; } }
	 * 
	 * 
	 * public byte[] getProfilePicture(Long id) { User user =
	 * userRepository.findById(id) .orElseThrow(() -> new
	 * RuntimeException("User not found"));
	 * 
	 * return user.getProfilePicture(); }
	 */
    
    
}
