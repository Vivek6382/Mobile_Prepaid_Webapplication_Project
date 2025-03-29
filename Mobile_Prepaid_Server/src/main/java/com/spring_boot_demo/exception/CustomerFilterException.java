package com.spring_boot_demo.exception;

public class CustomerFilterException extends RuntimeException {
    public CustomerFilterException(String message) {
        super(message);
    }

    public CustomerFilterException(String message, Throwable cause) {
        super(message, cause);
    }
}