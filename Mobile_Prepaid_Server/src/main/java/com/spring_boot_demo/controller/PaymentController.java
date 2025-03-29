package com.spring_boot_demo.controller;

import com.razorpay.RazorpayException;
import com.spring_boot_demo.dto.PaymentRequest;
import com.spring_boot_demo.dto.PaymentResponse;
import com.spring_boot_demo.dto.PaymentVerificationRequest;
import com.spring_boot_demo.model.Transaction;
import com.spring_boot_demo.service.EmailService;
import com.spring_boot_demo.service.RazorpayService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final RazorpayService razorpayService;
    private final EmailService emailService; // Add EmailService


    public PaymentController(RazorpayService razorpayService ,  EmailService emailService) {
        this.razorpayService = razorpayService;
        this.emailService = emailService;
    }
    

  
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentRequest paymentRequest) {
        try {
            PaymentResponse response = razorpayService.createOrder(paymentRequest);
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest verificationRequest) {
        try {
            boolean isSignatureValid = razorpayService.verifyPaymentSignature(verificationRequest);
            
            if (!isSignatureValid) {
                Map<String, String> response = new HashMap<>();
                response.put("status", "failure");
                response.put("message", "Payment verification failed");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            Transaction transaction = razorpayService.createTransaction(verificationRequest);
            
            // Send email confirmation
            boolean emailSent = emailService.sendTransactionConfirmationEmail(transaction);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Payment verified successfully");
            response.put("transactionId", transaction.getTransactionId());
            response.put("transaction", transaction);
            response.put("emailSent", emailSent);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "failure");
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}