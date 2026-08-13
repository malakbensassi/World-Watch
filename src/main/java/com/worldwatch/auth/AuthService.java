package com.worldwatch.auth;

public interface AuthService {
    UserDto register(String username, String rawPassword);
    String login(String username, String rawPassword); // renvoie le JWT
}