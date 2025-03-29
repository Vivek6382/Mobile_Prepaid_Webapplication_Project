package com.spring_boot_demo.security;

import com.spring_boot_demo.model.User;
import com.spring_boot_demo.repository.RevokedTokenRepository;
import com.spring_boot_demo.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RevokedTokenRepository revokedTokenRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String requestPath = request.getServletPath();

        // ✅ Ensure the filter skips these paths correctly
        if (requestPath.startsWith("/api/") || 
        	    requestPath.equals("/auth/register") || 
        	    requestPath.equals("/auth/login")) { 
        	    chain.doFilter(request, response);
        	    return;
        	}


        String token = request.getHeader("Authorization");

        if (token == null || !token.startsWith("Bearer ") || token.length() < 7) {
            sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid Authorization header.");
            return;
        }

        token = token.substring(7);

        try {
            if (revokedTokenRepository.findByToken(token).isPresent()) {
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Token has been revoked.");
                return;
            }

            String mobile = jwtUtil.getMobileFromToken(token);
            Optional<User> user = userRepository.findByMobile(mobile);

            if (user.isEmpty()) {
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "User not found.");
                return;
            }

            if (jwtUtil.isTokenExpired(token)) {
                sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token.");
                return;
            }

            String userRole = user.get().getRole().getRoleName().name();
            List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(userRole));

            UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                mobile, "", authorities
            );

            SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(userDetails, null, authorities)
            );

        } catch (ExpiredJwtException e) {
            sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Token expired.");
            return;
        } catch (JwtException e) {
            sendErrorResponse(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid token.");
            return;
        }

        chain.doFilter(request, response);
    }


    private void sendErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(
                new ErrorResponse(status, message)
        ));
    }

    private static class ErrorResponse {
        public int status;
        public String message;

        public ErrorResponse(int status, String message) {
            this.status = status;
            this.message = message;
        }
    }
}
