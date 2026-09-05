package com.worldwatch.auth.internal;

import com.worldwatch.auth.AuthService;
import com.worldwatch.auth.UserDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

record RegisterRequest(
        @NotBlank(message = "Username is required") String username,
        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters") String password
) {}

record LoginRequest(
        @NotBlank(message = "Username is required") String username,
        @NotBlank(message = "Password is required") String password
) {}

record LoginResponse(String token) {}

@RestController
@RequestMapping("/api/auth")
@Validated
class AuthController {

    private final AuthService authService;

    AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    UserDto register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request.username(), request.password());
    }

    @PostMapping("/login")
    LoginResponse login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request.username(), request.password());
        return new LoginResponse(token);
    }
}