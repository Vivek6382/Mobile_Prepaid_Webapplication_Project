package com.spring_boot_demo.service;

import com.spring_boot_demo.model.Transaction;
import com.spring_boot_demo.model.User;
import com.spring_boot_demo.model.PrepaidPlan;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private TemplateEngine templateEngine;
    
    @Value("${spring.mail.username}")
    private String senderEmail;

    /**
     * Sends a transaction confirmation email
     * 
     * @param transaction The transaction details
     * @return boolean indicating if email was sent successfully
     */
    public boolean sendTransactionConfirmationEmail(Transaction transaction) {
        try {
            // Extract necessary data
            User user = transaction.getUser();
            PrepaidPlan plan = transaction.getPlan();
            
            if (user == null || plan == null || user.getEmail() == null) {
                System.out.println("Missing required information for sending email");
                return false;
            }
            
            // Create HTML email using Thymeleaf template
            Context context = new Context(Locale.getDefault());
            
            // Add template variables
            context.setVariable("name", user.getName());
            context.setVariable("transactionId", transaction.getTransactionId());
            context.setVariable("transactionStatus", transaction.getTransactionStatus().toString());
            context.setVariable("refNumber", transaction.getRefNumber());
            context.setVariable("paymentMode", transaction.getPaymentMode().toString());
            context.setVariable("amount", transaction.getAmount());
            context.setVariable("planName", plan.getPlanName());
            context.setVariable("planValidity", plan.getValidity());
            context.setVariable("dailyData", plan.getDailyData());
            context.setVariable("totalData", plan.getTotalData());
            context.setVariable("voice", plan.getVoice());
            context.setVariable("sms", plan.getSms());
            
            // Parse and format dates
            try {
            	// Handle date formatting
                SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM yyyy");
                DateTimeFormatter dtFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
                
                // Format purchase date - FIXED THIS SECTION
                Date purchaseDate;
                if (transaction.getPurchasedOn() != null) {
                    purchaseDate = Date.from(transaction.getPurchasedOn().atZone(ZoneId.systemDefault()).toInstant());
                } else {
                    purchaseDate = new Date();
                }
                context.setVariable("purchasedOn", dateFormat.format(purchaseDate));
                
                // Format plan start date
                LocalDateTime planStart = null;
                Object planStartObj = transaction.getPlanStart();
                
                if (planStartObj instanceof String) {
                    try {
                        planStart = LocalDateTime.parse((String)planStartObj, dtFormatter);
                    } catch (DateTimeParseException e) {
                        planStart = LocalDateTime.now();
                    }
                } else if (planStartObj instanceof LocalDateTime) {
                    planStart = (LocalDateTime)planStartObj;
                } else {
                    planStart = LocalDateTime.now();
                }
                
                // Convert LocalDateTime to Date for formatting
                Date planStartDate = Date.from(planStart.atZone(ZoneId.systemDefault()).toInstant());
                context.setVariable("planStart", dateFormat.format(planStartDate));
                
                // Format plan end date
                LocalDateTime planEnd = null;
                Object planEndObj = transaction.getPlanEnd();
                
                if (planEndObj instanceof String) {
                    try {
                        planEnd = LocalDateTime.parse((String)planEndObj, dtFormatter);
                    } catch (DateTimeParseException e) {
                        // Calculate end date based on validity
                        Calendar calendar = Calendar.getInstance();
                        calendar.setTime(purchaseDate);
                        calendar.add(Calendar.DAY_OF_MONTH, plan.getValidity());
                        planEnd = calendar.getTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                    }
                } else if (planEndObj instanceof LocalDateTime) {
                    planEnd = (LocalDateTime)planEndObj;
                } else {
                    // Calculate end date based on validity
                    Calendar calendar = Calendar.getInstance();
                    calendar.setTime(purchaseDate);
                    calendar.add(Calendar.DAY_OF_MONTH, plan.getValidity());
                    planEnd = calendar.getTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
                }
                
                // Convert LocalDateTime to Date for formatting
                Date planEndDate = Date.from(planEnd.atZone(ZoneId.systemDefault()).toInstant());
                context.setVariable("planEnd", dateFormat.format(planEndDate));
                
            } catch (Exception e) {
                // Fallback if date parsing fails
                SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM yyyy");
                Date now = new Date();
                context.setVariable("purchasedOn", dateFormat.format(now));
                context.setVariable("planStart", dateFormat.format(now));
                
                // Set end date as validity days from now
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(now);
                calendar.add(Calendar.DAY_OF_MONTH, plan.getValidity());
                context.setVariable("planEnd", dateFormat.format(calendar.getTime()));
                
                System.out.println("Date parsing failed, using fallback dates: " + e.getMessage());
                e.printStackTrace();
            }
            
            // Add OTT benefits if available
            if (plan.getOtt() != null && !plan.getOtt().isEmpty()) {
                context.setVariable("hasOttBenefits", true);
                context.setVariable("ottBenefits", String.join(", ", plan.getOtt()));
            } else {
                context.setVariable("hasOttBenefits", false);
            }
            
            // Process the template
            String emailContent = templateEngine.process("transaction-confirmation", context);
            
            // Send the email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(user.getEmail());
            helper.setSubject("Mobi-Comm: Your Plan Purchase Was Successful!");
            helper.setText(emailContent, true); // true indicates HTML content
            helper.setFrom(senderEmail);
            
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + user.getEmail());
            return true;
            
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
            return false;
        } catch (Exception e) {
            System.err.println("Unexpected error sending email: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}