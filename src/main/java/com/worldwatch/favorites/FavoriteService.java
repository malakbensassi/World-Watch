package com.worldwatch.favorites;

import java.util.List;

public interface FavoriteService {
    FavoriteDto addFavorite(String countryCode, String countryName, String ownerId);
    void removeFavorite(Long favoriteId, String ownerId);
    List<FavoriteDto> getFavoritesForUser(String ownerId);
}