package com.spring_boot_demo.exception;

import java.util.ArrayList;
import java.util.List;

public class ValidationException extends RuntimeException {
    
    private static final long serialVersionUID = 1L;
    private final List<String> validationErrors = new ArrayList<>();

    public ValidationException(String message) {
        super(message);
    }
    
    public ValidationException(List<String> errors) {
        super("Validation failed");
        this.validationErrors.addAll(errors);
    }
    
    public ValidationException(String message, List<String> errors) {
        super(message);
        this.validationErrors.addAll(errors);
    }
    
    public List<String> getValidationErrors() {
        return validationErrors;
    }
    
    public void addError(String error) {
        this.validationErrors.add(error);
    }
}