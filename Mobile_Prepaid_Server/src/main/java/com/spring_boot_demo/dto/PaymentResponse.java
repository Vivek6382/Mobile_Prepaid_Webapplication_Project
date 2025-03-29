package com.spring_boot_demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private String orderId;
    private String razorpayOrderId;
    private Integer amount;
    private String currency;
    private String keyId;
}