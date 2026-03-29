package com.rgv.catalojogo.auth.service;

import com.rgv.catalojogo.user.entity.User;
import com.rgv.catalojogo.user.entity.UserRole;
import com.rgv.catalojogo.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AppUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AppUserDetailsService appUserDetailsService;

    @Test
    void loadUserByUsernameUsesPersistedRoleAsAuthority() {
        User user = new User();
        user.setUsername("admin");
        user.setEmail("admin@catalojogo.com");
        user.setPasswordHash("encoded-password");
        user.setRole(UserRole.ADMIN);

        when(userRepository.findByUsernameOrEmail("admin", "admin"))
                .thenReturn(Optional.of(user));

        UserDetails userDetails = appUserDetailsService.loadUserByUsername("admin");

        assertTrue(userDetails.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN")));
    }
}
