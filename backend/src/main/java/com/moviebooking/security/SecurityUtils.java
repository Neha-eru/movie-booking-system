package com.moviebooking.security;

import com.moviebooking.entity.User;
import com.moviebooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserRepository userRepository;

    // Get currently authenticated user entity
    public User getCurrentUser() {
        Object principal =
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getPrincipal();

        if (principal instanceof UserDetails ud) {
            return userRepository.findByEmail(ud.getUsername())
                    .orElseThrow(() ->
                            new RuntimeException("Authenticated user not found in DB"));
        }
        throw new RuntimeException("No authenticated user found");
    }

    // Get current user's ID
    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    // Check if current user is ADMIN
    public boolean isAdmin() {
        return getCurrentUser().getRole() == User.Role.ADMIN;
    }
}