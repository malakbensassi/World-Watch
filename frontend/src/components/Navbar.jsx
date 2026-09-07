import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  Search,
  User,
  LogIn,
  LogOut,
  ArrowRight,
  LayoutDashboard,
  Home,
  ShieldCheck,
  Sun,
  Moon,
  Map,
  Bot
} from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({
  currentView,
  onNavigate,
  onSelectCountry,
  selectedCountry,
  onOpenAuthModal
}) {
  const { user, isAuthenticated, logout, isDemoMode } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.capital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (country) => {
    onSelectCountry(country);
    setSearchTerm('');
    setIsDropdownOpen(false);
    if (currentView !== 'dashboard') {
      onNavigate('dashboard');
    }
  };

  return (
    <header className={`navbar ${currentView === 'landing' ? 'landing-navbar' : ''}`}>
      <div className="nav-wrapper">
        {/* Brand */}
        <div className="brand" onClick={() => onNavigate('landing')}>
          <div className="brand-logo-w">
            <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" fill="url(#brandGlow)" stroke="#06b6d4" strokeWidth="1.5" />
              <path d="M10 12L14 24L18 16L22 24L26 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="18" cy="17" r="4" fill="#06b6d4" fillOpacity="0.4" stroke="#22d3ee" strokeWidth="1" />
              <defs>
                <radialGradient id="brandGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0a192f" stopOpacity="0.9" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          <div className="brand-text-block">
            <span className="brand-title-styled">
              <strong style={{ color: '#ffffff', fontWeight: 700 }}>World</strong>
              <span style={{ color: '#38bdf8', fontWeight: 500, marginLeft: 2 }}>Watch</span>
            </span>
          </div>
        </div>

        {/* View-Specific Middle Navigation */}
        {currentView === 'landing' ? (
          <nav className="nav-links-center landing-nav-links">
            <a
              href="#hero"
              className="nav-link-mock active"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Accueil
              <span className="nav-indicator-active"></span>
            </a>
            <a
              href="#explore-monde"
              className="nav-link-mock"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('explore-monde')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explorer
            </a>
            <a
              onClick={() => onNavigate('dashboard')}
              className="nav-link-mock"
            >
              Pays
            </a>
            <a
              href="#dernieres-actualites"
              className="nav-link-mock"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('dernieres-actualites')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Actualités
            </a>
            <a
              onClick={() => onNavigate('dashboard')}
              className="nav-link-mock"
            >
              Favoris
            </a>
          </nav>
        ) : currentView === 'dashboard' ? (
          /* Search Bar in Dashboard */
          <div className="nav-search-container" ref={searchRef}>
            <div className="search-input-box">
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search 195+ sovereign nations, ISO code, or capital..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
              />
              {searchTerm && (
                <span
                  style={{ fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }}
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </span>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isDropdownOpen && filteredCountries.length > 0 && (
              <div className="search-dropdown">
                {filteredCountries.slice(0, 8).map((c) => (
                  <div
                    key={c.code}
                    className={`search-dropdown-item ${selectedCountry?.code === c.code ? 'active' : ''}`}
                    onClick={() => handleSelect(c)}
                  >
                    <div className="search-country-info">
                      <span className="country-flag">{c.flag}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{c.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Cap: {c.capital} • Cur: {c.currency}
                        </div>
                      </div>
                    </div>
                    <span className="iso-code-badge">{c.code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : currentView === 'map' ? (
          /* Search Bar also visible in Map view */
          <div className="nav-search-container" ref={searchRef}>
            <div className="search-input-box">
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search 195+ sovereign nations…"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
              />
              {searchTerm && (
                <span
                  style={{ fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }}
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </span>
              )}
            </div>
            {isDropdownOpen && filteredCountries.length > 0 && (
              <div className="search-dropdown">
                {filteredCountries.slice(0, 8).map((c) => (
                  <div
                    key={c.code}
                    className={`search-dropdown-item ${selectedCountry?.code === c.code ? 'active' : ''}`}
                    onClick={() => handleSelect(c)}
                  >
                    <div className="search-country-info">
                      <span className="country-flag">{c.flag}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{c.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Cap: {c.capital} · Cur: {c.currency}
                        </div>
                      </div>
                    </div>
                    <span className="iso-code-badge">{c.code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <nav className="nav-links-center">
            <a onClick={() => onNavigate('landing')} className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Home size={15} />
              <span>Back to Home</span>
            </a>
          </nav>
        )}

        {/* Action Controls & Theme Toggle */}
        <div className="nav-actions">
          {/* Light / Dark Mode Toggle Button only on Dashboard/Map */}
          {currentView !== 'landing' && (
            <button
              className="btn btn-secondary btn-icon"
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle color theme"
              style={{ width: 38, height: 38 }}
            >
              {isDark ? (
                <Sun size={17} color="var(--amber)" />
              ) : (
                <Moon size={17} color="var(--cyan-primary)" />
              )}
            </button>
          )}

          {currentView === 'landing' ? (
            <div className="landing-header-actions">
              <button
                className="btn-pill-ask-ai"
                onClick={() => {
                  const el = document.getElementById('world-ai');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onNavigate('dashboard');
                }}
              >
                <Bot size={15} color="#38bdf8" />
                <span>Ask AI</span>
              </button>

              <button
                className="btn-pill-connexion"
                onClick={() => onNavigate('signin')}
              >
                <span>Connexion</span>
              </button>

              <button
                className="btn-circle-user"
                onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'signin')}
                title={isAuthenticated ? user?.username : 'Compte'}
              >
                <User size={17} />
              </button>
            </div>
          ) : currentView === 'dashboard' || currentView === 'map' ? (
            <>
              {/* Map / Dashboard toggle button */}
              <button
                className={`btn ${currentView === 'map' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onNavigate(currentView === 'map' ? 'dashboard' : 'map')}
                title={currentView === 'map' ? 'Return to Terminal Dashboard' : 'Open Interactive World Map'}
              >
                {currentView === 'map' ? (
                  <><LayoutDashboard size={15} /><span>Dashboard</span></>
                ) : (
                  <><Map size={15} /><span>World Map</span></>
                )}
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => onNavigate('landing')}
                title="Return to Presentation Landing Page"
              >
                <Home size={15} />
                <span>Overview</span>
              </button>

              <div className="status-pill" title={isDemoMode ? "Running in interactive demo session" : "Connected to Spring Boot API"}>
                <span className={`pulse-dot ${isDemoMode ? 'warning' : ''}`}></span>
                <span>{isDemoMode ? 'Live Preview' : 'API Online'}</span>
              </div>

              {isAuthenticated ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(255,255,255,0.06)',
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: 'var(--cyan-primary)',
                        color: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.8rem'
                      }}
                    >
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.username}</span>
                  </div>
                  <button
                    className="btn btn-secondary btn-icon"
                    onClick={logout}
                    title="Log out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button className="btn btn-primary" onClick={() => onNavigate('signin')}>
                  <LogIn size={16} />
                  <span>Sign In</span>
                </button>
              )}
            </>
          ) : (
            /* On Sign In page */
            <button
              className="btn btn-primary"
              onClick={() => onNavigate('dashboard')}
            >
              <span>Access Terminal</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
