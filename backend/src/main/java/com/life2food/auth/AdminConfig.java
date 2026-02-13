package com.life2food.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminConfig {
    private final String email;
    private final String name;
    private final String role;
    private final String passwordHash;

    public AdminConfig(
            @Value("${app.admin.email}") String email,
            @Value("${app.admin.password}") String password,
            @Value("${app.admin.name}") String name,
            @Value("${app.admin.role}") String role,
            PasswordEncoder passwordEncoder
    ) {
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            throw new IllegalStateException("ADMIN_EMAIL and ADMIN_PASSWORD must be set");
        }
        this.email = email.trim().toLowerCase();
        this.name = name == null || name.isBlank() ? "Administrador" : name;
        this.role = role == null || role.isBlank() ? "SUPER_ADMIN" : role;
        this.passwordHash = passwordEncoder.encode(password);
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public String getPasswordHash() {
        return passwordHash;
    }
}
