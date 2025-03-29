package com.spring_boot_demo.exception;

//Exception for when a prepaid plan is not found
public class PrepaidPlanNotFoundException extends RuntimeException {
 public PrepaidPlanNotFoundException(String message) {
     super(message);
 }

 public PrepaidPlanNotFoundException(Long planId) {
     super("Prepaid plan with ID " + planId + " not found");
 }
}