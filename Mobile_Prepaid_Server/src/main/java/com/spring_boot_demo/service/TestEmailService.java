package com.spring_boot_demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class TestEmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String senderEmail;
    
    public boolean sendTestEmail(String to) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Test Email from Spring Boot");
            message.setText("This is a test email from your Spring Boot application.");
            message.setFrom(senderEmail);
            
            mailSender.send(message);
            System.out.println("Test email sent successfully to: " + to);
            return true;
        } catch (Exception e) {
            System.err.println("Failed to send test email: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
