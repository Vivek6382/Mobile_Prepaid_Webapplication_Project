package com.spring_boot_demo.service;

import com.spring_boot_demo.model.Transaction;
import com.spring_boot_demo.model.User;
import com.spring_boot_demo.repository.CustomerFilterRepository;
import com.spring_boot_demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CustomerFilterService {

    private final CustomerFilterRepository customerFilterRepository;
    private final TransactionRepository transactionRepository;
    
    // Date formatter - the original formatter only handled date part
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    @Autowired
    public CustomerFilterService(CustomerFilterRepository customerFilterRepository, 
                              TransactionRepository transactionRepository) {
        this.customerFilterRepository = customerFilterRepository;
        this.transactionRepository = transactionRepository;
    }
    
    // Non-paginated methods (keep these for backward compatibility)
    public List<Map<String, Object>> getAllCustomers() {
        List<User> customers = customerFilterRepository.findAllCustomersSimple();
        return processCustomersWithStatus(customers);
    }
    
    public List<Map<String, Object>> getExpiresSoonCustomers() {
        // Get all customers first
        List<User> allCustomers = customerFilterRepository.findAllCustomersSimple();
        
        // Then filter in Java code rather than complex JPQL
        return processCustomersWithStatus(allCustomers).stream()
                .filter(data -> "expires-soon".equals(data.get("status")))
                .collect(Collectors.toList());
    }
    
    public List<Map<String, Object>> getExpiredCustomers() {
        // Get all customers first
        List<User> allCustomers = customerFilterRepository.findAllCustomersSimple();
        
        // Then filter in Java code
        return processCustomersWithStatus(allCustomers).stream()
                .filter(data -> "expired".equals(data.get("status")))
                .collect(Collectors.toList());
    }
    
    public List<Map<String, Object>> getActiveCustomers() {
        // Get all customers first
        List<User> allCustomers = customerFilterRepository.findAllCustomersSimple();
        
        // Then filter in Java code
        return processCustomersWithStatus(allCustomers).stream()
                .filter(data -> "active".equals(data.get("status")))
                .collect(Collectors.toList());
    }
    
    // Paginated methods
    public Page<Map<String, Object>> getAllCustomersPaginated(Pageable pageable) {
        List<Map<String, Object>> allCustomers = getAllCustomers();
        return createPage(allCustomers, pageable);
    }
    
    public Page<Map<String, Object>> getExpiresSoonCustomersPaginated(Pageable pageable) {
        List<Map<String, Object>> expiresSoonCustomers = getExpiresSoonCustomers();
        return createPage(expiresSoonCustomers, pageable);
    }
    
    public Page<Map<String, Object>> getExpiredCustomersPaginated(Pageable pageable) {
        List<Map<String, Object>> expiredCustomers = getExpiredCustomers();
        return createPage(expiredCustomers, pageable);
    }
    
    public Page<Map<String, Object>> getActiveCustomersPaginated(Pageable pageable) {
        List<Map<String, Object>> activeCustomers = getActiveCustomers();
        return createPage(activeCustomers, pageable);
    }
    
    // Helper method to create a Page from a List
    private Page<Map<String, Object>> createPage(List<Map<String, Object>> list, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), list.size());
        
        // Handle case when start is beyond list size
        if (start >= list.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, list.size());
        }
        
        return new PageImpl<>(list.subList(start, end), pageable, list.size());
    }
    
    /**
     * Parse a date string that could be in various formats to LocalDate
     * @param dateString The date string to parse
     * @return The parsed LocalDate
     */
    private LocalDate parseDate(String dateString) {
        try {
            // First try with simple date format
            return LocalDate.parse(dateString, dateFormatter);
        } catch (DateTimeParseException e) {
            try {
                // Try with ISO format (has time and possibly timezone)
                return ZonedDateTime.parse(dateString).toLocalDate();
            } catch (DateTimeParseException e2) {
                try {
                    // Try with ISO local date time
                    return LocalDateTime.parse(dateString).toLocalDate();
                } catch (DateTimeParseException e3) {
                    // As a last resort, try default ISO_LOCAL_DATE
                    return LocalDate.parse(dateString);
                }
            }
        }
    }
    
    private List<Map<String, Object>> processCustomersWithStatus(List<User> customers) {
        List<Map<String, Object>> result = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        for (User user : customers) {
            Map<String, Object> customerData = new HashMap<>();
            customerData.put("user", user);
            
            // Get all transactions for this user ordered by plan end date (descending)
            List<Transaction> transactions = transactionRepository.findTransactionsByUserOrderByPlanEndDesc(user.getUserId());
            
            if (transactions.isEmpty()) {
                // No transactions found - expired by default
                customerData.put("transaction", null);
                customerData.put("status", "expired");
            } else {
                // Get active transactions (end date in the future)
                List<Transaction> activeTransactions = transactions.stream()
                        .filter(t -> {
                            try {
                                // Use the robust parse method instead of direct parsing
                                LocalDate planEndDate = parseDate(t.getPlanEnd());
                                // Check if it's after today
                                return planEndDate.isAfter(today);
                            } catch (Exception e) {
                                // If we can't parse the date at all, log it and filter it out
                                System.err.println("Error parsing date: " + t.getPlanEnd() + " for user ID: " + user.getUserId());
                                return false;
                            }
                        })
                        .collect(Collectors.toList());
                
                if (activeTransactions.isEmpty()) {
                    // No active plans - expired
                    // Use most recent transaction for display
                    customerData.put("transaction", transactions.get(0));
                    customerData.put("status", "expired");
                } else {
                    // We have an active plan - check if it expires soon
                    // Sort by closest end date
                    activeTransactions.sort((t1, t2) -> {
                        try {
                            LocalDate date1 = parseDate(t1.getPlanEnd());
                            LocalDate date2 = parseDate(t2.getPlanEnd());
                            return date1.compareTo(date2);
                        } catch (Exception e) {
                            // Fallback to string comparison if parsing fails
                            return t1.getPlanEnd().compareTo(t2.getPlanEnd());
                        }
                    });
                    
                    Transaction currentPlan = activeTransactions.get(0);
                    
                    try {
                        // Calculate days until expiry
                        LocalDate planEndDate = parseDate(currentPlan.getPlanEnd());
                        long daysDiff = ChronoUnit.DAYS.between(today, planEndDate);
                        
                        if (daysDiff <= 3) {
                            customerData.put("status", "expires-soon");
                        } else {
                            customerData.put("status", "active");
                        }
                    } catch (Exception e) {
                        // If we can't parse the date for expiry calculation, default to active
                        customerData.put("status", "active");
                        System.err.println("Error calculating expiry for user ID: " + user.getUserId());
                    }
                    
                    customerData.put("transaction", currentPlan);
                }
            }
            
            result.add(customerData);
        }
        
        return result;
    }
}