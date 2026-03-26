package com.rgv.catalojogo.auth.service;

import com.rgv.catalojogo.auth.dto.AuthResponse;
import com.rgv.catalojogo.auth.dto.LoginRequest;
import com.rgv.catalojogo.auth.dto.RegisterRequest;
import com.rgv.catalojogo.common.exception.BadRequestException;
import com.rgv.catalojogo.security.JwtService;
import com.rgv.catalojogo.user.entity.User;
import com.rgv.catalojogo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByUsername(username)) {
            throw new BadRequestException("username already in use");
        }
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("email already in use");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);
        return toAuthResponse(savedUser, token);
    }

    public AuthResponse login(LoginRequest request) {
        String login = request.getLogin().trim();
        String normalizedLogin = login.contains("@") ? login.toLowerCase() : login;
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedLogin, request.getPassword())
        );

        User user = userRepository.findByUsernameOrEmail(normalizedLogin, normalizedLogin)
                .orElseThrow(() -> new BadCredentialsException("Invalid login credentials"));
        String token = jwtService.generateToken(user);
        return toAuthResponse(user, token);
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return new AuthResponse(
                token,
                "Bearer",
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }
}
