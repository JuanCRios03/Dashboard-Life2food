package com.life2food.security;

import com.life2food.auth.AdminConfig;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final AdminConfig adminConfig;

    public UserDetailsServiceImpl(AdminConfig adminConfig) {
        this.adminConfig = adminConfig;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String email = username == null ? "" : username.trim().toLowerCase();
        if (!email.equals(adminConfig.getEmail())) {
            throw new UsernameNotFoundException("User not found");
        }

        return new org.springframework.security.core.userdetails.User(
                adminConfig.getEmail(),
                adminConfig.getPasswordHash(),
                true,
                true,
                true,
                true,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + adminConfig.getRole()))
        );
    }
}
