package com.rgv.catalojogo.auth.service;

import com.rgv.catalojogo.auth.dto.AuthResponse;
import com.rgv.catalojogo.auth.dto.RegisterRequest;
import com.rgv.catalojogo.security.JwtService;
import com.rgv.catalojogo.user.entity.User;
import com.rgv.catalojogo.user.entity.UserRole;
import com.rgv.catalojogo.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerAssignsAdminRoleToFirstUser() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("admin");
        request.setEmail("admin@catalojogo.com");
        request.setPassword("123456");

        when(userRepository.existsByUsername("admin")).thenReturn(false);
        when(userRepository.existsByEmail("admin@catalojogo.com")).thenReturn(false);
        when(userRepository.existsByRole(UserRole.ADMIN)).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals(UserRole.ADMIN, userCaptor.getValue().getRole());
        assertEquals("ADMIN", response.getRole());
    }

    @Test
    void registerAssignsUserRoleWhenAdminAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("player");
        request.setEmail("player@catalojogo.com");
        request.setPassword("123456");

        when(userRepository.existsByUsername("player")).thenReturn(false);
        when(userRepository.existsByEmail("player@catalojogo.com")).thenReturn(false);
        when(userRepository.existsByRole(UserRole.ADMIN)).thenReturn(true);
        when(passwordEncoder.encode("123456")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(2L);
            return user;
        });
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals(UserRole.USER, userCaptor.getValue().getRole());
        assertEquals("USER", response.getRole());
    }
}
