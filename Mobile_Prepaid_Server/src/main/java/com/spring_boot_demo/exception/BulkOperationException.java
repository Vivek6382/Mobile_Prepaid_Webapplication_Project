package com.spring_boot_demo.exception;

import java.util.List;

//Exception for errors in bulk operations
public class BulkOperationException extends RuntimeException {
 private List<String> failedOperations;

 public BulkOperationException(String message) {
     super(message);
 }

 public BulkOperationException(String message, List<String> failedOperations) {
     super(message);
     this.failedOperations = failedOperations;
 }

 public List<String> getFailedOperations() {
     return failedOperations;
 }
}