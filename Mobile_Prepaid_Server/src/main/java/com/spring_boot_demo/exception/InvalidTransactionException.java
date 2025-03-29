package com.spring_boot_demo.exception;

//Exception for invalid transaction creation or update
public class InvalidTransactionException extends RuntimeException {
 public InvalidTransactionException(String message) {
     super(message);
 }
}