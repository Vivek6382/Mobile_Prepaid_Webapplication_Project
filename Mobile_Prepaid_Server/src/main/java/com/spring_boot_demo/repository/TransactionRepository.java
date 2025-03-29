package com.spring_boot_demo.repository;

import com.spring_boot_demo.model.Transaction;
import com.spring_boot_demo.model.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    // Find all transactions for a user by userId
    List<Transaction> findByUserUserId(Long userId);
    
    // Find transaction by transactionId
    Optional<Transaction> findById(Long transactionId);
    
    // Find transactions by user mobile number
    List<Transaction> findByUserMobile(String mobile);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.userId = :userId AND t.planEnd >= :today ORDER BY t.planEnd ASC")
    List<Transaction> findActiveTransactionsByUser(@Param("userId") Long userId, @Param("today") Date today);
    
    @Query("SELECT t FROM Transaction t WHERE t.user.userId = :userId ORDER BY t.planEnd DESC")
    List<Transaction> findTransactionsByUserOrderByPlanEndDesc(@Param("userId") Long userId);
    
    // Pagination methods
    Page<Transaction> findAll(Pageable pageable);
    
    // Find transactions by user mobile with pagination
    Page<Transaction> findByUserMobile(String mobile, Pageable pageable);
    
    // New filter methods with pagination
    
    // Find by transaction status
    Page<Transaction> findByTransactionStatus(TransactionStatus status, Pageable pageable);
    
    // Find by user mobile and transaction status
    Page<Transaction> findByUserMobileAndTransactionStatus(String mobile, TransactionStatus status, Pageable pageable);
}