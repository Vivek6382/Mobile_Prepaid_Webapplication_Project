package com.spring_boot_demo.exception;

//Exception for when a prepaid plan already exists (e.g., duplicate name)
public class PrepaidPlanAlreadyExistsException extends RuntimeException {
 public PrepaidPlanAlreadyExistsException(String message) {
     super(message);
 }

 public PrepaidPlanAlreadyExistsException(String planName, String existingDetail) {
     super("Prepaid plan with name '" + planName + "' already exists. " + existingDetail);
 }
}