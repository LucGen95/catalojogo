package com.rgv.catalojogo.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "username is required")
    @Size(min = 3, max = 80, message = "username must be between 3 and 80 characters")
    private String username;

    @NotBlank(message = "email is required")
    @Email(message = "email must be valid")
    @Size(max = 150, message = "email must have at most 150 characters")
    private String email;

    @NotBlank(message = "password is required")
    @Size(min = 6, max = 100, message = "password must be between 6 and 100 characters")
    private String password;
}
