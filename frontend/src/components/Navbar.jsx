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
  Map
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
    <header className="navbar">
      <div className="nav-wrapper">
        {/* Brand */}
        <div className="brand" onClick={() => onNavigate('landing')}>
          <div className="brand-icon-wrapper">
            <Globe size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-title">WORLD WATCH</span>
              <span className="brand-badge">FINTECH PRO</span>
            </div>
          </div>
        </div>

        {/* View-Specific Middle Navigation */}
        {currentView === 'landing' ? (
          <nav className="nav-links-center">
            <a href="#features" className="nav-link">Capabilities</a>
            <a onClick={() => onNavigate('dashboard')} className="nav-link">Spot FX Market</a>
            <a onClick={() => onNavigate('dashboard')} className="nav-link">AI Intelligence</a>
            <a onClick={() => onNavigate('signin')} className="nav-link">Enterprise Auth</a>
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
          {/* Light / Dark Mode Toggle Button */}
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

          {currentView === 'landing' ? (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => onNavigate('signin')}
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>

              <button
                className="btn btn-primary"
                onClick={() => onNavigate('dashboard')}
              >
                <span>Access Terminal</span>
                <ArrowRight size={16} />
              </button>
            </>
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
