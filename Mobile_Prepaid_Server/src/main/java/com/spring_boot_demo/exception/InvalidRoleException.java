package com.spring_boot_demo.exception;

//Exception for invalid role creation or update
public class InvalidRoleException extends RuntimeException {
 public InvalidRoleException(String message) {
     super(message);
 }
}