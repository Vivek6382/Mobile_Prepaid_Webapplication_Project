package com.spring_boot_demo.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp = LocalDateTime.now();
    
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Operation successful", data, LocalDateTime.now());
    }
    
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, LocalDateTime.now());
    }
    
    public static <T> ApiResponse<T> failure(String message) {
        return new ApiResponse<>(false, message, null, LocalDateTime.now());
    }
    
    // Add this new method
    public static <T> ApiResponse<T> failure(T errorDetails) {
        return new ApiResponse<>(false, "Operation failed", errorDetails, LocalDateTime.now());
    }
}