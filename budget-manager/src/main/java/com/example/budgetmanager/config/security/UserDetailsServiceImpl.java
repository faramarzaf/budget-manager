package com.example.budgetmanager.config.security;

import com.example.budgetmanager.domain.user.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        com.example.budgetmanager.domain.user.User appUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Spring Security's User object requires a username, password, and authorities.
        // We pass the hashed password, although it's not strictly needed for JWT validation itself.
        // The authorities list is empty for now as we don't have roles like "ADMIN".
        return new User(appUser.getEmail(), appUser.getPasswordHash(), new ArrayList<>());
    }
}