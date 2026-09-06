package com.worldwatch.auth.internal;

import com.worldwatch.auth.AuthService;
import com.worldwatch.auth.UserDto;
import org.springframework.web.bind.annotation.*;

record RegisterRequest(String username, String password) {}
record LoginRequest(String username, String password) {}
record LoginResponse(String token) {}

@RestController
@RequestMapping("/api/auth")
class AuthController {

    private final AuthService authService;

    AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    UserDto register(@RequestBody RegisterRequest request) {
        return authService.register(request.username(), request.password());
    }

    @PostMapping("/login")
    LoginResponse login(@RequestBody LoginRequest request) {
        String token = authService.login(request.username(), request.password());
        return new LoginResponse(token);
    }
}