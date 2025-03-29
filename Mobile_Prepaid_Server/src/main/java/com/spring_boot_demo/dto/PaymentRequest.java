package com.spring_boot_demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private Long userId;
    private Long planId;
    private String currency = "INR";
    private String mobile;
}