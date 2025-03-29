package com.spring_boot_demo.service;

import com.spring_boot_demo.model.RevokedToken;
import com.spring_boot_demo.model.Transaction;
import com.spring_boot_demo.model.TransactionStatus;
import com.spring_boot_demo.repository.TransactionRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);  // Save the transaction to the database
    }
    
    // Get all transactions
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // Get transaction by ID
    public Optional<Transaction> getTransactionById(Long transactionId) {
        return transactionRepository.findById(transactionId);
    }
    
    // Get transactions by user mobile number
    public List<Transaction> getTransactionsByMobile(String mobile) {
        return transactionRepository.findByUserMobile(mobile);
    }
    
    // Get paginated transactions
    public Page<Transaction> getTransactionsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return transactionRepository.findAll(pageable);
    }
    
    // Get paginated transactions by mobile
    public Page<Transaction> getTransactionsByMobilePaginated(String mobile, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return transactionRepository.findByUserMobile(mobile, pageable);
    }
    
    // New methods for filtered transactions
    
    // Get paginated transactions by status
    public Page<Transaction> getTransactionsByStatusPaginated(TransactionStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return transactionRepository.findByTransactionStatus(status, pageable);
    }
    
    // Get paginated transactions by mobile and status
    public Page<Transaction> getTransactionsByMobileAndStatusPaginated(String mobile, TransactionStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return transactionRepository.findByUserMobileAndTransactionStatus(mobile, status, pageable);
    }
}