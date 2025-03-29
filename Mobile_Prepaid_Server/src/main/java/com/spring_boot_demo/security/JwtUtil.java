package com.spring_boot_demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key;

    // ✅ Inject the JWT secret directly from application.properties
    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(Long userId, String mobile, String role) {
        return Jwts.builder()
                .setSubject(mobile) // 🔹 Store mobile instead of username
                .claim("id", userId)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // ✅ Token valid for 1 hour
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(String mobile) {
        return Jwts.builder()
                .setSubject(mobile) // 🔹 Store mobile instead of username
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7)) // ✅ Refresh token valid for 7 days
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getMobileFromToken(String token) { 
        return getClaimsFromToken(token).getSubject(); // ✅ Returns mobile now
    }
    

    public boolean isTokenExpired(String token) {
        return getClaimsFromToken(token).getExpiration().before(new Date());
    }

    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }

    public String getRoleFromToken(String token) {
        return (String) getClaimsFromToken(token).get("role");
    }

    public String getUsernameFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

}
