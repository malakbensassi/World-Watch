package com.worldwatch.favorites;

public record FavoriteDto(
        Long id,
        String countryCode,
        String countryName,
        String ownerId
) {}