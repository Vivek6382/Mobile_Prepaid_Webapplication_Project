package com.spring_boot_demo.controller;

import com.spring_boot_demo.model.PrepaidPlan;
import com.spring_boot_demo.model.Transaction;
import com.spring_boot_demo.model.TransactionStatus;
import com.spring_boot_demo.model.User;
import com.spring_boot_demo.service.EmailService;
import com.spring_boot_demo.model.PaymentMode;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/send-test-email")
    public ResponseEntity<Map<String, Object>> testEmail(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Create a dummy transaction with minimal data for testing
            Transaction testTransaction = new Transaction();

            User testUser = new User();
            testUser.setName("Test User");
            testUser.setEmail(email);

            PrepaidPlan testPlan = new PrepaidPlan();
            testPlan.setPlanName("Test Plan");
            testPlan.setValidity(30);
            testPlan.setDailyData("1.5 GB/day");
            testPlan.setTotalData("45 GB");
            testPlan.setVoice("Unlimited");
            testPlan.setSms("100 SMS/day");
            // Set OTT benefits for testing
            testPlan.setOtt(Arrays.asList("Netflix", "Amazon Prime"));

            testTransaction.setUser(testUser);
            testTransaction.setPlan(testPlan);
            testTransaction.setTransactionId(System.currentTimeMillis()); // Fixed: Using Long instead of String
            testTransaction.setTransactionStatus(TransactionStatus.SUCCESSFUL);
            testTransaction.setAmount(new BigDecimal("499.00"));
            testTransaction.setPaymentMode(PaymentMode.ONLINE);
            testTransaction.setRefNumber("TEST-REF-" + System.currentTimeMillis());
            testTransaction.setPurchasedOn(LocalDateTime.now());

            LocalDateTime now = LocalDateTime.now();
            testTransaction.setPlanStart(now.toString());  // Convert LocalDateTime to String
            testTransaction.setPlanEnd(now.plusDays(30).toString());  // Convert LocalDateTime to String

            // Try to send the email
            boolean sent = emailService.sendTransactionConfirmationEmail(testTransaction);

            response.put("success", sent);
            response.put("message", sent ? "Test email sent successfully" : "Failed to send test email");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/send-custom-email")
    public ResponseEntity<Map<String, Object>> sendCustomEmail(@RequestBody EmailTestRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            Transaction transaction = new Transaction();
            
            // Set user details
            User user = new User();
            user.setName(request.getUserName());
            user.setEmail(request.getUserEmail());
            
            // Set plan details
            PrepaidPlan plan = new PrepaidPlan();
            plan.setPlanName(request.getPlanName());
            plan.setValidity(request.getPlanValidity());
            plan.setDailyData(request.getDailyData());
            plan.setTotalData(request.getTotalData());
            plan.setVoice(request.getVoice());
            plan.setSms(request.getSms());
            plan.setOtt(request.getOttBenefits());
            
            // Set transaction details
            transaction.setUser(user);
            transaction.setPlan(plan);
            transaction.setTransactionId(request.getTransactionId());
            transaction.setTransactionStatus(TransactionStatus.valueOf(request.getTransactionStatus()));
            transaction.setAmount(new BigDecimal(request.getAmount()));
            transaction.setPaymentMode(PaymentMode.valueOf(request.getPaymentMode()));
            transaction.setRefNumber(request.getRefNumber());
            
            LocalDateTime purchasedOn = LocalDateTime.parse(request.getPurchasedOn());
            transaction.setPurchasedOn(purchasedOn);
            
            // Handle plan start and end dates
         // Handle plan start and end dates
            LocalDateTime planStart = LocalDateTime.parse(request.getPlanStart());
            LocalDateTime planEnd = LocalDateTime.parse(request.getPlanEnd());
            transaction.setPlanStart(planStart.toString());  // Convert LocalDateTime to String
            transaction.setPlanEnd(planEnd.toString());  // Convert LocalDateTime to String
            
            // Send the email
            boolean sent = emailService.sendTransactionConfirmationEmail(transaction);
            
            response.put("success", sent);
            response.put("message", sent ? "Custom email sent successfully" : "Failed to send custom email");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Request DTO for the custom email endpoint
    public static class EmailTestRequest {
        private String userName;
        private String userEmail;
        private String planName;
        private int planValidity;
        private String dailyData;
        private String totalData;
        private String voice;
        private String sms;
        private java.util.List<String> ottBenefits;
        private Long transactionId;
        private String transactionStatus;
        private String amount;
        private String paymentMode;
        private String refNumber;
        private String purchasedOn;
        private String planStart;
        private String planEnd;

        // Getters and setters
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        
        public String getUserEmail() { return userEmail; }
        public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
        
        public String getPlanName() { return planName; }
        public void setPlanName(String planName) { this.planName = planName; }
        
        public int getPlanValidity() { return planValidity; }
        public void setPlanValidity(int planValidity) { this.planValidity = planValidity; }
        
        public String getDailyData() { return dailyData; }
        public void setDailyData(String dailyData) { this.dailyData = dailyData; }
        
        public String getTotalData() { return totalData; }
        public void setTotalData(String totalData) { this.totalData = totalData; }
        
        public String getVoice() { return voice; }
        public void setVoice(String voice) { this.voice = voice; }
        
        public String getSms() { return sms; }
        public void setSms(String sms) { this.sms = sms; }
        
        public java.util.List<String> getOttBenefits() { return ottBenefits; }
        public void setOttBenefits(java.util.List<String> ottBenefits) { this.ottBenefits = ottBenefits; }
        
        public Long getTransactionId() { return transactionId; }
        public void setTransactionId(Long transactionId) { this.transactionId = transactionId; }
        
        public String getTransactionStatus() { return transactionStatus; }
        public void setTransactionStatus(String transactionStatus) { this.transactionStatus = transactionStatus; }
        
        public String getAmount() { return amount; }
        public void setAmount(String amount) { this.amount = amount; }
        
        public String getPaymentMode() { return paymentMode; }
        public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }
        
        public String getRefNumber() { return refNumber; }
        public void setRefNumber(String refNumber) { this.refNumber = refNumber; }
        
        public String getPurchasedOn() { return purchasedOn; }
        public void setPurchasedOn(String purchasedOn) { this.purchasedOn = purchasedOn; }
        
        public String getPlanStart() { return planStart; }
        public void setPlanStart(String planStart) { this.planStart = planStart; }
        
        public String getPlanEnd() { return planEnd; }
        public void setPlanEnd(String planEnd) { this.planEnd = planEnd; }
    }
}