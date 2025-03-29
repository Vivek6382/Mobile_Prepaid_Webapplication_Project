package com.spring_boot_demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring_boot_demo.service.OtpService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/otp")
public class OtpController {
    @Autowired
    private OtpService otpService;
    
    @PostMapping("/generate")
    public ResponseEntity<?> generateOTP(@RequestBody Map<String, String> request) {
        String mobileNumber = request.get("mobile");
        
        if (mobileNumber == null || mobileNumber.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mobile number is required"));
        }
        
        // Using "sms" as the channel
        boolean sent = otpService.sendOTP(mobileNumber, "sms");
        
        Map<String, Object> response = new HashMap<>();
        if (sent) {
            response.put("success", true);
            response.put("message", "OTP sent successfully");
        } else {
            response.put("success", false);
            response.put("message", "Failed to send OTP");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/verify")
    public ResponseEntity<?> verifyOTP(@RequestBody Map<String, String> request) {
        String mobileNumber = request.get("mobile");
        String otp = request.get("otp");
        
        if (mobileNumber == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mobile number and OTP are required"));
        }
        
        boolean verified = otpService.verifyOTP(mobileNumber, otp);
        
        Map<String, Object> response = new HashMap<>();
        if (verified) {
            response.put("success", true);
            response.put("message", "OTP verified successfully");
        } else {
            response.put("success", false);
            response.put("message", "Invalid OTP");
        }
        
        return ResponseEntity.ok(response);
    }
}