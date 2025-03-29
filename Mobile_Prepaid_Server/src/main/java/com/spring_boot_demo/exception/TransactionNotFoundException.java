package com.spring_boot_demo.exception;

//Exception for when a transaction is not found
public class TransactionNotFoundException extends RuntimeException {
 public TransactionNotFoundException(String message) {
     super(message);
 }

 public TransactionNotFoundException(Long transactionId) {
     super("Transaction with ID " + transactionId + " not found");
 }
}