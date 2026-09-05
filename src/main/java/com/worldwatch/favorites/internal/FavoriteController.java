package com.worldwatch.favorites.internal;

import com.worldwatch.favorites.FavoriteDto;
import com.worldwatch.favorites.FavoriteService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@Validated
class FavoriteController {

    private final FavoriteService favoriteService;

    FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping
    FavoriteDto add(@RequestParam @NotBlank String countryCode,
                    @RequestParam @NotBlank String countryName,
                    Authentication authentication) {
        String ownerId = authentication.getName();
        return favoriteService.addFavorite(countryCode, countryName, ownerId);
    }

    @DeleteMapping("/{id}")
    void remove(@PathVariable Long id, Authentication authentication) {
        String ownerId = authentication.getName();
        favoriteService.removeFavorite(id, ownerId);
    }

    @GetMapping
    List<FavoriteDto> list(Authentication authentication) {
        String ownerId = authentication.getName();
        return favoriteService.getFavoritesForUser(ownerId);
    }
}