package com.worldwatch.favorites.internal;

import jakarta.persistence.*;

@Entity
@Table(name = "favorites")
class Favorite { // pas de 'public', cohérent avec ton architecture

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String countryCode;

    @Column(nullable = false)
    private String countryName;

    @Column(nullable = false)
    private String ownerId; // temporaire, deviendra le username Spring Security plus tard

    protected Favorite() {} // requis par JPA

    Favorite(String countryCode, String countryName, String ownerId) {
        this.countryCode = countryCode;
        this.countryName = countryName;
        this.ownerId = ownerId;
    }

    Long getId() { return id; }
    String getCountryCode() { return countryCode; }
    String getCountryName() { return countryName; }
    String getOwnerId() { return ownerId; }
}