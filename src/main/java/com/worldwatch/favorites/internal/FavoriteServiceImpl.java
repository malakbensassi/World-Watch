package com.worldwatch.favorites.internal;

import com.worldwatch.favorites.FavoriteDto;
import com.worldwatch.favorites.FavoriteService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository repository;

    FavoriteServiceImpl(FavoriteRepository repository) {
        this.repository = repository;
    }

    @Override
    public FavoriteDto addFavorite(String countryCode, String countryName, String ownerId) {
        Favorite favorite = new Favorite(countryCode, countryName, ownerId);
        Favorite saved = repository.save(favorite);
        return toDto(saved);
    }

    @Override
    public void removeFavorite(Long favoriteId, String ownerId) {
        Favorite favorite = repository.findById(favoriteId)
                .orElseThrow(() -> new IllegalArgumentException("Favorite not found"));

        if (!favorite.getOwnerId().equals(ownerId)) {
            throw new SecurityException("Not authorized to delete this favorite");
        }
        repository.deleteById(favoriteId);
    }

    @Override
    public List<FavoriteDto> getFavoritesForUser(String ownerId) {
        return repository.findByOwnerId(ownerId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    private FavoriteDto toDto(Favorite favorite) {
        return new FavoriteDto(
                favorite.getId(),
                favorite.getCountryCode(),
                favorite.getCountryName(),
                favorite.getOwnerId()
        );
    }
}