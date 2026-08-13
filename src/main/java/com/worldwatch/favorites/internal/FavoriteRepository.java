package com.worldwatch.favorites.internal;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByOwnerId(String ownerId);
}