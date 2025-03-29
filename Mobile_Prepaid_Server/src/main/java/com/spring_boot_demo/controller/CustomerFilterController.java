package com.spring_boot_demo.controller;

import com.spring_boot_demo.service.CustomerFilterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerFilterController {

    private final CustomerFilterService customerFilterService;
    
    @Autowired
    public CustomerFilterController(CustomerFilterService customerFilterService) {
        this.customerFilterService = customerFilterService;
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllCustomers() {
        return ResponseEntity.ok(customerFilterService.getAllCustomers());
    }
    
    @GetMapping("/expires-soon")
    public ResponseEntity<List<Map<String, Object>>> getExpiresSoonCustomers() {
        return ResponseEntity.ok(customerFilterService.getExpiresSoonCustomers());
    }
    
    @GetMapping("/expired")
    public ResponseEntity<List<Map<String, Object>>> getExpiredCustomers() {
        return ResponseEntity.ok(customerFilterService.getExpiredCustomers());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Map<String, Object>>> getActiveCustomers() {
        return ResponseEntity.ok(customerFilterService.getActiveCustomers());
    }
    
    // New paginated endpoints
    @GetMapping("/all/paginated")
    public ResponseEntity<Page<Map<String, Object>>> getAllCustomersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(customerFilterService.getAllCustomersPaginated(pageable));
    }
    
    @GetMapping("/expires-soon/paginated")
    public ResponseEntity<Page<Map<String, Object>>> getExpiresSoonCustomersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(customerFilterService.getExpiresSoonCustomersPaginated(pageable));
    }
    
    @GetMapping("/expired/paginated")
    public ResponseEntity<Page<Map<String, Object>>> getExpiredCustomersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(customerFilterService.getExpiredCustomersPaginated(pageable));
    }
    
    @GetMapping("/active/paginated")
    public ResponseEntity<Page<Map<String, Object>>> getActiveCustomersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "3") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(customerFilterService.getActiveCustomersPaginated(pageable));
    }
}

