package com.spring_boot_demo.config;

import com.spring_boot_demo.model.UserContactMethod;
import com.spring_boot_demo.model.UserCommunicationLanguage;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Component
public class UserDataLoader implements CommandLineRunner {

    @Override
    @Transactional  
    public void run(String... args) throws Exception {
        System.out.println("UserDataLoader started...");

        // Display Contact Methods
        List<UserContactMethod> contactMethods = Arrays.asList(UserContactMethod.values());
        System.out.println("Available Contact Methods: " + contactMethods);

        // Display Communication Languages
        List<UserCommunicationLanguage> communicationLanguages = Arrays.asList(UserCommunicationLanguage.values());
        System.out.println("Available Communication Languages: " + communicationLanguages);
    }
}
