import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import SignInPage from './components/SignInPage';
import FavoritesBar from './components/FavoritesBar';
import CountryHero from './components/CountryHero';
import EconomicsWidget from './components/EconomicsWidget';
import ConflictsWidget from './components/ConflictsWidget';
import ExchangeWidget from './components/ExchangeWidget';
import NewsWidget from './components/NewsWidget';
import AiChatWidget from './components/AiChatWidget';
import AuthModal from './components/AuthModal';
import WorldMap from './components/WorldMap';
import { COUNTRIES } from './data/countries';
import {
  fetchCountryData,
  fetchCountryDetails,
  fetchFavorites,
  addFavorite as apiAddFavorite,
  removeFavorite as apiRemoveFavorite
} from './api/client';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthenticated, token } = useAuth();

  // View Routing: 'landing' | 'dashboard' | 'map' | 'signin'
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'dashboard' || hash === 'signin' || hash === 'map') return hash;
    return 'landing'; // Default to presentation landing page
  });

  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Default: Morocco (MA)
  const [countryData, setCountryData] = useState(null);
  const [countryDetails, setCountryDetails] = useState(null);
  const [isLoadingCountry, setIsLoadingCountry] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync view changes with browser hash
  const navigateTo = (view) => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['landing', 'dashboard', 'map', 'signin'].includes(hash)) {
        setCurrentView(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3200);
  };

  // 1. Load Country Data and Detailed Governance Dossier
  useEffect(() => {
    let isMounted = true;
    async function loadCountry() {
      setIsLoadingCountry(true);
      try {
        const [data, details] = await Promise.all([
          fetchCountryData(selectedCountry.code),
          fetchCountryDetails(selectedCountry.code)
        ]);
        if (isMounted) {
          setCountryData(data || null);
          setCountryDetails(details || selectedCountry.details || null);
        }
      } catch (err) {
        if (isMounted) {
          setCountryData(null);
          setCountryDetails(selectedCountry.details || null);
        }
      } finally {
        if (isMounted) setIsLoadingCountry(false);
      }
    }
    loadCountry();
    return () => { isMounted = false; };
  }, [selectedCountry.code]);

  // 2. Load User Favorites
  useEffect(() => {
    async function loadFavs() {
      try {
        const data = await fetchFavorites();
        if (Array.isArray(data)) {
          setFavorites(data);
        } else {
          const localFavs = localStorage.getItem('worldwatch_local_favs');
          if (localFavs) {
            setFavorites(JSON.parse(localFavs));
          } else {
            setFavorites([{ id: 1, countryCode: 'MA', countryName: 'Morocco' }]);
          }
        }
      } catch {
        const localFavs = localStorage.getItem('worldwatch_local_favs');
        if (localFavs) {
          setFavorites(JSON.parse(localFavs));
        }
      }
    }
    loadFavs();
  }, [token]);

  const isFavorite = favorites.some(f => f.countryCode === selectedCountry.code);

  const handleToggleFavorite = async () => {
    const existing = favorites.find(f => f.countryCode === selectedCountry.code);

    if (existing) {
      try {
        if (existing.id && typeof existing.id === 'number') {
          await apiRemoveFavorite(existing.id);
        }
      } catch (err) {
        console.warn('API remove favorite fallback to local storage');
      }
      const updated = favorites.filter(f => f.countryCode !== selectedCountry.code);
      setFavorites(updated);
      localStorage.setItem('worldwatch_local_favs', JSON.stringify(updated));
      showToast(`Removed ${selectedCountry.name} from your Watchlist`);
    } else {
      const newFavObj = {
        id: Date.now(),
        countryCode: selectedCountry.code,
        countryName: selectedCountry.name
      };

      try {
        const res = await apiAddFavorite(selectedCountry.code, selectedCountry.name);
        if (res && res.id) {
          newFavObj.id = res.id;
        }
      } catch (err) {
        console.warn('API add favorite fallback to local storage');
      }

      const updated = [...favorites, newFavObj];
      setFavorites(updated);
      localStorage.setItem('worldwatch_local_favs', JSON.stringify(updated));
      showToast(`Added ${selectedCountry.name} to your Watchlist`);
    }
  };

  const handleRemoveFavoriteFromChip = async (fav) => {
    try {
      if (fav.id && typeof fav.id === 'number') {
        await apiRemoveFavorite(fav.id);
      }
    } catch {
      // ignore
    }
    const updated = favorites.filter(f => f.countryCode !== fav.countryCode);
    setFavorites(updated);
    localStorage.setItem('worldwatch_local_favs', JSON.stringify(updated));
    showToast(`Removed ${fav.countryName} from Watchlist`);
  };

  return (
    <div className="app-container">
      {/* Universal FinTech Navbar with Theme Toggle */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        onOpenAuthModal={() => setIsAuthModalOpen(false)}
      />

      {/* View Switcher */}
      {currentView === 'landing' ? (
        <LandingPage
          onNavigateToDashboard={() => navigateTo('dashboard')}
          onNavigateToSignIn={() => navigateTo('signin')}
          onNavigateToMap={() => navigateTo('map')}
          onSelectCountry={(c) => {
            setSelectedCountry(c);
            navigateTo('dashboard');
          }}
        />
      ) : currentView === 'signin' ? (
        <SignInPage
          onNavigateToHome={() => navigateTo('landing')}
          onNavigateToDashboard={() => navigateTo('dashboard')}
        />
      ) : currentView === 'map' ? (
        <WorldMap
          selectedCountry={selectedCountry}
          onSelectCountry={(country) => {
            setSelectedCountry(country);
          }}
          onNavigateToDashboard={() => navigateTo('dashboard')}
        />
      ) : (
        /* Terminal / Dashboard View */
        <main className="main-content">
          {/* Watchlist Strip */}
          <FavoritesBar
            favorites={favorites}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
            onRemoveFavorite={handleRemoveFavoriteFromChip}
            countriesList={COUNTRIES}
          />

          {/* Hero Country Overview & Governance Dossier */}
          <CountryHero
            country={selectedCountry}
            countryData={countryData}
            countryDetails={countryDetails}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            isLoading={isLoadingCountry}
          />

          {/* Full-Width Macroeconomic Indicators Surface */}
          <EconomicsWidget country={selectedCountry} />

          {/* Dynamic 2-Column Geopolitical & Intelligence Grid */}
          <div className="dashboard-grid">
            {/* Left Column: Forex Converter & Yahoo Finance News */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <ExchangeWidget
                targetCurrency={countryData?.currency || selectedCountry.currency}
                countryName={selectedCountry.name}
              />

              <NewsWidget countryName={selectedCountry.name} />
            </div>

            {/* Right Column: Conflicts & Risk + Gemini AI Analyst */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <ConflictsWidget country={selectedCountry} />

              <AiChatWidget country={selectedCountry} />
            </div>
          </div>
        </main>
      )}

      {/* Auxiliary Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Toast Alert */}
      {toast && (
        <div className="toast-msg">
          <span style={{ color: 'var(--cyan-primary)', fontWeight: 600 }}>WorldWatch:</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
