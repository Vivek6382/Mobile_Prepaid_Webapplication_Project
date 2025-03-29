package com.spring_boot_demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring_boot_demo.config.TwilioConfig;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import com.twilio.type.PhoneNumber;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {
    @Autowired
    private TwilioConfig twilioConfig;
    
    // Send OTP via Twilio Verify API
    public boolean sendOTP(String mobileNumber, String channel) {
        try {
            // Format the phone number (add country code if not present)
            String formattedNumber = mobileNumber.startsWith("+") ? mobileNumber : "+91" + mobileNumber;
            
            // Send verification code using Twilio Verify API
            Verification verification = Verification.creator(
                    twilioConfig.getVerifyServiceSid(),
                    formattedNumber,
                    channel) // "sms" or "call"
                .create();
            
            return "pending".equals(verification.getStatus());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    // Verify the OTP using Twilio Verify API
    public boolean verifyOTP(String mobileNumber, String otp) {
        try {
            // Format the phone number (add country code if not present)
            String formattedNumber = mobileNumber.startsWith("+") ? mobileNumber : "+91" + mobileNumber;
            
            // Verify the code
            VerificationCheck verificationCheck = VerificationCheck.creator(
            	    twilioConfig.getVerifyServiceSid())
            	    .setTo(formattedNumber)
            	    .setCode(otp)
            	    .create();
            
            return "approved".equals(verificationCheck.getStatus());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}