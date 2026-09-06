package com.worldwatch.auth.internal;

import jakarta.persistence.*;

@Entity
@Table(name = "app_users")
class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password; // hashé BCrypt

    protected AppUser() {}

    AppUser(String username, String password) {
        this.username = username;
        this.password = password;
    }

    Long getId() { return id; }
    String getUsername() { return username; }
    String getPassword() { return password; }
}