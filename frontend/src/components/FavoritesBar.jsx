import React from 'react';
import { Star, X, Bookmark } from 'lucide-react';

export default function FavoritesBar({
  favorites,
  selectedCountry,
  onSelectCountry,
  onRemoveFavorite,
  countriesList
}) {
  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-strip" style={{ justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.84rem' }}>
        <Bookmark size={15} color="var(--cyan-primary)" style={{ marginRight: 6 }} />
        <span>No pinned countries yet. Click the bookmark star on any country card to add to your quick watchlist.</span>
      </div>
    );
  }

  return (
    <div className="favorites-strip">
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--amber)', fontSize: '0.8rem', fontWeight: 600, paddingRight: 6 }}>
        <Star size={14} fill="var(--amber)" />
        <span>WATCHLIST ({favorites.length})</span>
      </div>

      {favorites.map((fav) => {
        // Find matching country metadata for flag & details
        const countryMeta = countriesList.find(c => c.code === fav.countryCode) || {
          code: fav.countryCode,
          name: fav.countryName,
          flag: '🌐'
        };
        const isActive = selectedCountry?.code === fav.countryCode;

        return (
          <div
            key={fav.id || fav.countryCode}
            className={`favorite-chip ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCountry(countryMeta)}
            title={`Switch view to ${countryMeta.name}`}
          >
            <span>{countryMeta.flag}</span>
            <span style={{ fontWeight: 600 }}>{countryMeta.name}</span>
            <span className="iso-code-badge" style={{ fontSize: '0.7rem', padding: '1px 5px' }}>{countryMeta.code}</span>
            <button
              className="favorite-chip-remove"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite(fav);
              }}
              title="Remove from favorites"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
