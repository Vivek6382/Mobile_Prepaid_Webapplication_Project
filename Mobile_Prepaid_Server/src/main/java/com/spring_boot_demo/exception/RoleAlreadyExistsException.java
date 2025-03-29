package com.spring_boot_demo.exception;

//Exception for attempting to create a role that already exists
public class RoleAlreadyExistsException extends RuntimeException {
 public RoleAlreadyExistsException(String message) {
     super(message);
 }
}