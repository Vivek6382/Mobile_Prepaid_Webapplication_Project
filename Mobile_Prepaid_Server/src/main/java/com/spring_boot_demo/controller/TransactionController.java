package com.spring_boot_demo.controller;

import com.spring_boot_demo.model.Transaction;
import com.spring_boot_demo.model.TransactionStatus;
import com.spring_boot_demo.model.User;
import com.spring_boot_demo.model.PrepaidPlan;
import com.spring_boot_demo.service.TransactionService;
import com.spring_boot_demo.service.UserService;
import com.spring_boot_demo.service.PrepaidPlanService;
import com.spring_boot_demo.exception.TransactionNotFoundException;
import com.spring_boot_demo.exception.InvalidTransactionException;
import com.spring_boot_demo.exception.TransactionValidationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final UserService userService;
    private final PrepaidPlanService planService;

    public TransactionController(TransactionService transactionService, UserService userService, PrepaidPlanService planService) {
        this.transactionService = transactionService;
        this.userService = userService;
        this.planService = planService;
    }

    // Endpoint to get all transactions
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.status(HttpStatus.OK).body(transactions);
    }

    // Endpoint to get a single transaction by transactionId
    @GetMapping("/{transactionId}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long transactionId) {
        return transactionService.getTransactionById(transactionId)
            .map(transaction -> ResponseEntity.status(HttpStatus.OK).body(transaction))
            .orElseThrow(() -> new TransactionNotFoundException(transactionId));
    }

    @PostMapping
    public ResponseEntity<Transaction> saveTransaction(@RequestBody Transaction transaction) {
        // Validate transaction before processing
        validateTransaction(transaction);

        // Fetch the User and PrepaidPlan from the database using the userId and planId
        Optional<User> userOptional = userService.findById(transaction.getUser().getUserId());
        Optional<PrepaidPlan> planOptional = planService.findById(transaction.getPlan().getPlanId());

        if (userOptional.isPresent() && planOptional.isPresent()) {
            // Set the user and plan in the transaction
            transaction.setUser(userOptional.get());
            transaction.setPlan(planOptional.get());

            // Save the transaction
            Transaction savedTransaction = transactionService.saveTransaction(transaction);

            return ResponseEntity.status(HttpStatus.CREATED).body(savedTransaction);
        }

        throw new InvalidTransactionException("Invalid user or plan");
    }

    // Validate transaction details
    private void validateTransaction(Transaction transaction) {
        // Check for null or invalid fields
        if (transaction == null) {
            throw new InvalidTransactionException("Transaction cannot be null");
        }

        // Validate amount
        if (transaction.getAmount() == null || transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new TransactionValidationException("Invalid transaction amount");
        }

        // Validate purchase date
        if (transaction.getPurchasedOn() == null) {
            transaction.setPurchasedOn(LocalDateTime.now());
        }

        // Validate reference number
        if (transaction.getRefNumber() == null || transaction.getRefNumber().trim().isEmpty()) {
            throw new TransactionValidationException("Reference number is required");
        }

        // Validate plan start and end dates
        if (transaction.getPlanStart() == null || transaction.getPlanStart().trim().isEmpty() ||
            transaction.getPlanEnd() == null || transaction.getPlanEnd().trim().isEmpty()) {
            throw new TransactionValidationException("Plan start and end dates are required");
        }

        // Validate transaction status (set to SUCCESSFUL by default if not provided)
        if (transaction.getTransactionStatus() == null) {
            transaction.setTransactionStatus(TransactionStatus.SUCCESSFUL);
        }
    }
    
    // New endpoint to get transactions by user mobile number
    @GetMapping("/user/{mobile}")
    public ResponseEntity<List<Transaction>> getTransactionsByMobile(@PathVariable String mobile) {
        List<Transaction> transactions = transactionService.getTransactionsByMobile(mobile);
        if (transactions.isEmpty()) {
            throw new TransactionNotFoundException("No transactions found for mobile number: " + mobile);
        }
        return ResponseEntity.status(HttpStatus.OK).body(transactions);
    }

    // Updated paginated endpoint with filter support
    @GetMapping("/paginated")
    public ResponseEntity<Page<Transaction>> getPaginatedTransactions(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "3") Integer size,
            @RequestParam(required = false) String status) {
        
        Page<Transaction> transactions;
        
        if (status == null || status.equalsIgnoreCase("all")) {
            transactions = transactionService.getTransactionsPaginated(page, size);
        } else {
            TransactionStatus transStatus = status.equalsIgnoreCase("successful") ? 
                TransactionStatus.SUCCESSFUL : TransactionStatus.FAILED;
            transactions = transactionService.getTransactionsByStatusPaginated(transStatus, page, size);
        }
        
        return ResponseEntity.status(HttpStatus.OK).body(transactions);
    }
    
    // Updated paginated endpoint with filter support for mobile
    @GetMapping("/user/{mobile}/paginated")
    public ResponseEntity<Page<Transaction>> getPaginatedTransactionsByMobile(
            @PathVariable String mobile,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "3") Integer size,
            @RequestParam(required = false) String status) {
        
        Page<Transaction> transactions;
        
        if (status == null || status.equalsIgnoreCase("all")) {
            transactions = transactionService.getTransactionsByMobilePaginated(mobile, page, size);
        } else {
            TransactionStatus transStatus = status.equalsIgnoreCase("successful") ? 
                TransactionStatus.SUCCESSFUL : TransactionStatus.FAILED;
            transactions = transactionService.getTransactionsByMobileAndStatusPaginated(mobile, transStatus, page, size);
        }
        
        return ResponseEntity.status(HttpStatus.OK).body(transactions);
    }
}