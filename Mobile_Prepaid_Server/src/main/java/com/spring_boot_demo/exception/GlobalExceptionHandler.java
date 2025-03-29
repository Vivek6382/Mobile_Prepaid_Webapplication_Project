package com.spring_boot_demo.exception;

import com.spring_boot_demo.dto.ApiResponse;
import com.spring_boot_demo.dto.ErrorDetails;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import jakarta.persistence.EntityNotFoundException;

import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Handle ResourceNotFoundException
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.NOT_FOUND);
    }
    
    // Handle CategoryNotFoundException
    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleCategoryNotFoundException(
            CategoryNotFoundException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.NOT_FOUND);
    }
    
    
    // Handle EntityNotFoundException
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleEntityNotFoundException(
            EntityNotFoundException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.NOT_FOUND);
    }
    
    // Handle DuplicateResourceException
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleDuplicateResourceException(
            DuplicateResourceException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.CONFLICT.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.CONFLICT);
    }
    
    // Handle ValidationException
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleValidationException(
            ValidationException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        // Add validation errors if present
        if (!ex.getValidationErrors().isEmpty()) {
            ex.getValidationErrors().forEach(errorDetails::addError);
        }
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.BAD_REQUEST);
    }
    
    // Handle MethodArgumentNotValidException for @Valid annotation validations
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, WebRequest request) {
        
        List<String> errors = new ArrayList<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.add(fieldName + ": " + errorMessage);
        });
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.BAD_REQUEST.value(),
            "Validation failed",
            request.getDescription(false)
        );
        
        errors.forEach(errorDetails::addError);
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.BAD_REQUEST);
    }
    
    // Handle DataIntegrityViolationException for database constraint violations
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleDataIntegrityViolation(
            DataIntegrityViolationException ex, WebRequest request) {
        
        String message = "Database integrity violation";
        
        // Extract more useful info from the exception if possible
        if (ex.getMostSpecificCause() != null) {
            message = ex.getMostSpecificCause().getMessage();
            
            // Check for duplicate entry
            if (message.contains("Duplicate entry") || message.contains("unique constraint")) {
                message = "A record with the same unique identifier already exists";
            }
        }
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.CONFLICT.value(),
            message,
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.CONFLICT);
    }
    
    // Handle BadCredentialsException for authentication failures
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleBadCredentials(
            BadCredentialsException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.UNAUTHORIZED.value(),
            "Invalid username or password",
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.UNAUTHORIZED);
    }
    
    // Handle AccessDeniedException for authorization failures
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleAccessDenied(
            AccessDeniedException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.FORBIDDEN.value(),
            "You don't have permission to access this resource",
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.FORBIDDEN);
    }
    
    // Handle HttpMessageNotReadableException
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.BAD_REQUEST.value(),
            "Malformed JSON request",
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.BAD_REQUEST);
    }
    
    // Handle MissingServletRequestParameterException
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleMissingServletRequestParameter(
            MissingServletRequestParameterException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.BAD_REQUEST.value(),
            "Required parameter is missing: " + ex.getParameterName(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.BAD_REQUEST);
    }
    
    // Handle HttpRequestMethodNotSupportedException
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleHttpRequestMethodNotSupported(
            HttpRequestMethodNotSupportedException ex, WebRequest request) {
        
        StringBuilder supportedMethods = new StringBuilder();
        if (ex.getSupportedHttpMethods() != null) {
            ex.getSupportedHttpMethods().forEach(method -> supportedMethods.append(method).append(", "));
        }
        
        String message = "Method " + ex.getMethod() + " not supported. Supported methods are: " 
                         + supportedMethods.toString().trim();
        
        if (supportedMethods.length() > 0) {
            message = message.substring(0, message.length() - 2);
        }
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.METHOD_NOT_ALLOWED.value(),
            message,
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.METHOD_NOT_ALLOWED);
    }
    
    // Handle HttpMediaTypeNotSupportedException
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleHttpMediaTypeNotSupported(
            HttpMediaTypeNotSupportedException ex, WebRequest request) {
        
        StringBuilder supportedMediaTypes = new StringBuilder();
        ex.getSupportedMediaTypes().forEach(mediaType -> supportedMediaTypes.append(mediaType).append(", "));
        
        String message = "Media type " + ex.getContentType() + " not supported. Supported media types are: " 
                        + supportedMediaTypes.substring(0, supportedMediaTypes.length() - 2);
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.UNSUPPORTED_MEDIA_TYPE.value(),
            message,
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }
    
    // Handle NoHandlerFoundException
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleNoHandlerFoundException(
            NoHandlerFoundException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.NOT_FOUND.value(),
            "No handler found for " + ex.getHttpMethod() + " " + ex.getRequestURL(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.NOT_FOUND);
    }
    
    // Handle MethodArgumentTypeMismatchException
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException ex, WebRequest request) {
        
        String message = ex.getName() + " should be of type " + ex.getRequiredType().getName();
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.BAD_REQUEST.value(),
            message,
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.BAD_REQUEST);
    }
    
    // Handle general exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleGlobalException(
            Exception ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred",
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    // Helper method for ApiResponse
    private <T> ApiResponse<T> failure(T errorDetails) {
        return new ApiResponse<>(false, "Operation failed", errorDetails, java.time.LocalDateTime.now());
    }
    
    
    
    
    // Specific handler for PrepaidPlan-related exceptions
    @ExceptionHandler(PrepaidPlanNotFoundException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handlePrepaidPlanNotFoundException(
            PrepaidPlanNotFoundException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.NOT_FOUND);
    }

    // Handler for invalid prepaid plan creation or update
    @ExceptionHandler(InvalidPrepaidPlanException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleInvalidPrepaidPlanException(
            InvalidPrepaidPlanException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        // Add any specific validation errors
        if (ex.getValidationErrors() != null) {
            ex.getValidationErrors().forEach(errorDetails::addError);
        }
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.BAD_REQUEST);
    }

    // Handler for prepaid plan already exists (unique constraint violation)
    @ExceptionHandler(PrepaidPlanAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handlePrepaidPlanAlreadyExistsException(
            PrepaidPlanAlreadyExistsException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.CONFLICT.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.CONFLICT);
    }

    // Handler for bulk operations errors
    @ExceptionHandler(BulkOperationException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleBulkOperationException(
            BulkOperationException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        // If there are specific details about which operations failed
        if (ex.getFailedOperations() != null && !ex.getFailedOperations().isEmpty()) {
            ex.getFailedOperations().forEach(errorDetails::addError);
        }
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    

    
    
    // Transcation  Exception handler 
    
 // Handle TransactionNotFoundException
    @ExceptionHandler(TransactionNotFoundException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleTransactionNotFoundException(
            TransactionNotFoundException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.NOT_FOUND);
    }

    // Handle InvalidTransactionException
    @ExceptionHandler(InvalidTransactionException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleInvalidTransactionException(
            InvalidTransactionException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.BAD_REQUEST);
    }

    // Handle TransactionValidationException
    @ExceptionHandler(TransactionValidationException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleTransactionValidationException(
            TransactionValidationException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.BAD_REQUEST);
    }
    
    
    
    
    
    //Role Exception Handler
    
    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleRoleNotFoundException(
            RoleNotFoundException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidRoleException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleInvalidRoleException(
            InvalidRoleException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RoleAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleRoleAlreadyExistsException(
            RoleAlreadyExistsException ex, WebRequest request) {
        
        ErrorDetails errorDetails = new ErrorDetails(
            HttpStatus.CONFLICT.value(),
            ex.getMessage(),
            request.getDescription(false)
        );
        
        return new ResponseEntity<>(ApiResponse.failure(errorDetails), HttpStatus.CONFLICT);
    }
    
    
}