package com.spring_boot_demo.exception;

public class CategoryNotFoundException extends ResourceNotFoundException {
    
    private static final long serialVersionUID = 1L;

    public CategoryNotFoundException(String message) {
        super(message);
    }
    
    public CategoryNotFoundException(Long id) {
        super("Category", "id", id);
    }
    
    public CategoryNotFoundException(String fieldName, Object fieldValue) {
        super("Category", fieldName, fieldValue);
    }
}