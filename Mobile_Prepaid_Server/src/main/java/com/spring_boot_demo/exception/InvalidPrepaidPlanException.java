package com.spring_boot_demo.exception;

import java.util.List;

//Exception for invalid prepaid plan data
public class InvalidPrepaidPlanException extends RuntimeException {
 private List<String> validationErrors;

 public InvalidPrepaidPlanException(String message) {
     super(message);
 }

 public InvalidPrepaidPlanException(String message, List<String> validationErrors) {
     super(message);
     this.validationErrors = validationErrors;
 }

 public List<String> getValidationErrors() {
     return validationErrors;
 }
}