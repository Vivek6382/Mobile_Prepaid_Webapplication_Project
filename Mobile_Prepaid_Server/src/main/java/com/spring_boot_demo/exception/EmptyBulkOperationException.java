package com.spring_boot_demo.exception;

public class EmptyBulkOperationException extends RuntimeException {
    public EmptyBulkOperationException(String message) {
        super(message);
    }
}