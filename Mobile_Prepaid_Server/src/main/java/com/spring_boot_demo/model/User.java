package com.spring_boot_demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = true,  unique = true, length = 100)
    private String username;

    @Column(unique = true, length = 15)
    private String mobile;

    @Column(nullable = true)
    private String password;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private String dob;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    private String alternateNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserContactMethod contactMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserCommunicationLanguage communicationLanguage;


    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Boolean isActive = true;
    
    
    @Lob
    @Column(name = "profile_picture", columnDefinition = "LONGBLOB")
    @Basic(fetch = FetchType.LAZY)
    private byte[] profilePicture;


    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
//    @JsonBackReference  // This prevents the role from being serialized as part of the 'users' reference
    private Role role;

    public Role getRole() {  // Ensure getter exists
        return role;
    }
}
