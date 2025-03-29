package com.spring_boot_demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetails {
    private LocalDateTime timestamp = LocalDateTime.now();
    private String message;
    private String details;
    private int status;
    private List<String> errors = new ArrayList<>();

    public ErrorDetails(int status, String message, String details) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.message = message;
        this.details = details;
    }

    public void addError(String error) {
        this.errors.add(error);
    }
}