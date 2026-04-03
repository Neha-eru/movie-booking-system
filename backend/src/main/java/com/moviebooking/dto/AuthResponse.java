package com.moviebooking.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String username;
    private String email;
    private String role;
    private Long userId;
}