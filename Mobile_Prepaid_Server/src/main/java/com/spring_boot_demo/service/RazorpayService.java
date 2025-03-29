package com.spring_boot_demo.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.spring_boot_demo.dto.PaymentRequest;
import com.spring_boot_demo.dto.PaymentResponse;
import com.spring_boot_demo.dto.PaymentVerificationRequest;
import com.spring_boot_demo.model.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class RazorpayService {

    private final RazorpayClient razorpayClient;
    private final PrepaidPlanService prepaidPlanService;
    private final UserService userService;
    private final TransactionService transactionService;

    @Value("${razorpay.api.secret}")
    private String razorpayKeySecret;

    @Value("${razorpay.api.key}")
    private String razorpayKeyId;

    public RazorpayService(RazorpayClient razorpayClient, 
                           PrepaidPlanService prepaidPlanService, 
                           UserService userService,
                           TransactionService transactionService) {
        this.razorpayClient = razorpayClient;
        this.prepaidPlanService = prepaidPlanService;
        this.userService = userService;
        this.transactionService = transactionService;
    }

 // In RazorpayService.java
    public PaymentResponse createOrder(PaymentRequest paymentRequest) throws RazorpayException {
        Optional<PrepaidPlan> planOptional = prepaidPlanService.findById(paymentRequest.getPlanId());
        
        if (planOptional.isEmpty()) {
            throw new IllegalArgumentException("Invalid plan ID");
        }
        
        PrepaidPlan plan = planOptional.get();
        
        // Convert price to lowest denomination (paise for INR)
        int amountInPaise = plan.getPrice().multiply(new BigDecimal("100")).intValue();
        
        // Generate a shorter receipt ID - just use timestamp and limit to 20 chars
        String receipt = "rcpt_" + System.currentTimeMillis() % 10000000;
        
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", paymentRequest.getCurrency());
        orderRequest.put("receipt", receipt);
        orderRequest.put("payment_capture", 1);
        
        Order order = razorpayClient.orders.create(orderRequest);
        
        return new PaymentResponse(
            order.get("receipt"),
            order.get("id"),
            amountInPaise,
            order.get("currency"),
            razorpayKeyId
        );
    }

    public boolean verifyPaymentSignature(PaymentVerificationRequest request) {
        try {
            String data = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
            
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(razorpayKeySecret.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secretKey);
            
            byte[] hash = sha256_HMAC.doFinal(data.getBytes());
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            
            return hexString.toString().equals(request.getRazorpaySignature());
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            return false;
        }
    }
    
 // In RazorpayService.java
    public Transaction createTransaction(PaymentVerificationRequest request) {
        Optional<User> userOptional = userService.findById(request.getUserId());
        Optional<PrepaidPlan> planOptional = prepaidPlanService.findById(request.getPlanId());
        
        if (userOptional.isEmpty() || planOptional.isEmpty()) {
            throw new IllegalArgumentException("Invalid user or plan ID");
        }
        
        User user = userOptional.get();
        PrepaidPlan plan = planOptional.get();
        
        Transaction transaction = new Transaction();
        transaction.setAmount(plan.getPrice());
        transaction.setTransactionStatus(TransactionStatus.SUCCESSFUL);
        transaction.setPlanStatus(PlanStatus.ACTIVE);
        transaction.setPurchasedOn(LocalDateTime.now());
        transaction.setPaymentMode(PaymentMode.ONLINE);
        transaction.setRefNumber(request.getRazorpayPaymentId());
        
        // Calculate plan start and end dates
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime endDate = now.plus(plan.getValidity(), ChronoUnit.DAYS);
        
        // Store as ISO format for consistent handling on frontend
        transaction.setPlanStart(now.toString());
        transaction.setPlanEnd(endDate.toString());
        transaction.setUser(user);
        transaction.setPlan(plan);
        
        // Save the transaction
        Transaction savedTransaction = transactionService.saveTransaction(transaction);
        
        return savedTransaction;
    }
}