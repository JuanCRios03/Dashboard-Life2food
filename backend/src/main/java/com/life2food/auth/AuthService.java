package com.life2food.auth;

import com.life2food.auth.dto.AuthResponse;
import com.life2food.auth.dto.LoginRequest;
import com.life2food.auth.dto.VerifyCodeRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;

@Service
public class AuthService {
    private static final String CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private final AdminConfig adminConfig;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final SecureRandom secureRandom = new SecureRandom();

    private final int codeTtlMinutes;
    private final int codeMaxAttempts;
    private final int loginMaxAttempts;
    private final int loginLockMinutes;

    private final Object lock = new Object();
    private int failedLoginCount = 0;
    private Instant lockUntil = null;
    private CodeState codeState = null;

    public AuthService(
            AdminConfig adminConfig,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            JwtService jwtService,
            @Value("${app.auth.codeTtlMinutes}") int codeTtlMinutes,
            @Value("${app.auth.codeMaxAttempts}") int codeMaxAttempts,
            @Value("${app.auth.loginMaxAttempts}") int loginMaxAttempts,
            @Value("${app.auth.loginLockMinutes}") int loginLockMinutes
    ) {
        this.adminConfig = adminConfig;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.codeTtlMinutes = codeTtlMinutes;
        this.codeMaxAttempts = codeMaxAttempts;
        this.loginMaxAttempts = loginMaxAttempts;
        this.loginLockMinutes = loginLockMinutes;
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());
        if (!email.equals(adminConfig.getEmail())) {
            throw new IllegalArgumentException("Credenciales invalidas");
        }

        synchronized (lock) {
            if (lockUntil != null && lockUntil.isAfter(Instant.now())) {
                throw new IllegalArgumentException("Cuenta bloqueada temporalmente");
            }

            if (!passwordEncoder.matches(request.getPassword(), adminConfig.getPasswordHash())) {
                failedLoginCount += 1;
                if (failedLoginCount >= loginMaxAttempts) {
                    lockUntil = Instant.now().plusSeconds(loginLockMinutes * 60L);
                }
                throw new IllegalArgumentException("Credenciales invalidas");
            }

            failedLoginCount = 0;
            lockUntil = null;

            String code = generateCode(6);
            codeState = new CodeState(
                    email,
                    passwordEncoder.encode(code),
                    Instant.now().plusSeconds(codeTtlMinutes * 60L)
            );
            emailService.sendVerificationCode(email, code);
        }

        AuthResponse response = new AuthResponse();
        response.setStatus("verification_required");
        response.setMessage("Codigo enviado a tu correo");
        return response;
    }

    public AuthResponse verifyCode(VerifyCodeRequest request) {
        String email = normalizeEmail(request.getEmail());
        synchronized (lock) {
            if (codeState == null || !codeState.email.equals(email)) {
                throw new IllegalArgumentException("Codigo invalido");
            }

            if (codeState.expiresAt.isBefore(Instant.now())) {
                throw new IllegalArgumentException("Codigo expirado");
            }

            if (codeState.attempts >= codeMaxAttempts) {
                throw new IllegalArgumentException("Demasiados intentos");
            }

            if (!passwordEncoder.matches(request.getCode().toUpperCase(), codeState.codeHash)) {
                codeState.attempts += 1;
                throw new IllegalArgumentException("Codigo invalido");
            }

            codeState = null;
        }

        String token = jwtService.generateToken(adminConfig.getEmail(), adminConfig.getRole());
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                adminConfig.getEmail(),
                adminConfig.getName(),
                adminConfig.getRole()
        );
        return new AuthResponse(token, userInfo, "Login exitoso");
    }

    public AuthResponse refresh(String email) {
        String normalized = normalizeEmail(email);
        if (!normalized.equals(adminConfig.getEmail())) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }

        String token = jwtService.generateToken(adminConfig.getEmail(), adminConfig.getRole());
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
                adminConfig.getEmail(),
                adminConfig.getName(),
                adminConfig.getRole()
        );
        return new AuthResponse(token, userInfo, "Token renovado");
    }

    private String generateCode(int length) {
        StringBuilder builder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            builder.append(CODE_CHARS.charAt(secureRandom.nextInt(CODE_CHARS.length())));
        }
        return builder.toString();
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private static final class CodeState {
        private final String email;
        private final String codeHash;
        private final Instant expiresAt;
        private int attempts = 0;

        private CodeState(String email, String codeHash, Instant expiresAt) {
            this.email = email;
            this.codeHash = codeHash;
            this.expiresAt = expiresAt;
        }
    }
}
