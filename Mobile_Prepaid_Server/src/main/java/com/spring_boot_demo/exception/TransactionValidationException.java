package com.spring_boot_demo.exception;

//Exception for transaction-related validation errors
public class TransactionValidationException extends RuntimeException {
 public TransactionValidationException(String message) {
     super(message);
 }
}