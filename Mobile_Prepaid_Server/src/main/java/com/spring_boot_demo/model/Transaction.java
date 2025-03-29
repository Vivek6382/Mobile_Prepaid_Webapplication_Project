package com.spring_boot_demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private TransactionStatus transactionStatus;

    @Enumerated(EnumType.STRING)
    private PlanStatus planStatus;

    @Column(nullable = false)
    private LocalDateTime purchasedOn;

    @Enumerated(EnumType.STRING)
    private PaymentMode paymentMode;

    @Column(unique = true, nullable = false)
    private String refNumber;

    @Column(nullable = false)
    private String planStart;

    @Column(nullable = false)
    private String planEnd;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plan_id", nullable = false)
    private PrepaidPlan plan;


    // No need for Many-to-One for Category, as it is already handled via Plan
}
