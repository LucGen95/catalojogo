package com.rgv.catalojogo.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String tokenType;
    private Long userId;
    private String username;
    private String email;
}
