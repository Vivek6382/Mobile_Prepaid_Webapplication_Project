package com.spring_boot_demo.exception;

//Exception for when a role is not found
public class RoleNotFoundException extends RuntimeException {
 public RoleNotFoundException(String message) {
     super(message);
 }

 public RoleNotFoundException(String roleName, String additionalInfo) {
     super("Role '" + roleName + "' not found. " + additionalInfo);
 }
}