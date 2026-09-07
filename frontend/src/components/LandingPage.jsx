import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Search,
  ArrowRight,
  Bot,
  TrendingUp,
  Compass,
  FileText,
  Newspaper,
  Send,
  Plus,
  Minus,
  Crosshair
} from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { fetchLiveTickerRates } from '../api/client';

/* ── Crisp Cross-Platform SVG Country Flags ────────────── */
export function FlagIcon({ country, width = 22, height = 15, radius = 3 }) {
  const c = country.toUpperCase();
  const style = { width, height, borderRadius: radius, flexShrink: 0, display: 'inline-block', verticalAlign: 'middle', boxShadow: '0 1px 4px rgba(0,0,0,0.4)' };

  if (c === 'MA' || c === 'MOROCCO' || c === 'MAROC') {
    return (
      <svg style={style} viewBox="0 0 900 600">
        <rect width="900" height="600" fill="#c1272d" />
        <polygon
          points="450,195 478,282 569,282 496,335 524,422 450,369 376,422 404,335 331,282 422,282"
          fill="none"
          stroke="#006233"
          strokeWidth="24"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (c === 'FR' || c === 'FRANCE') {
    return (
      <svg style={style} viewBox="0 0 900 600">
        <rect width="300" height="600" fill="#002395" />
        <rect x="300" width="300" height="600" fill="#ffffff" />
        <rect x="600" width="300" height="600" fill="#ed2939" />
      </svg>
    );
  }
  if (c === 'US' || c === 'USA' || c === 'ÉTATS-UNIS' || c === 'ETATS-UNIS') {
    return (
      <svg style={style} viewBox="0 0 7410 3900">
        <rect width="7410" height="3900" fill="#b22234" />
        <path d="M0,450H7410M0,1050H7410M0,1650H7410M0,2250H7410M0,2850H7410M0,3450H7410" stroke="#fff" strokeWidth="300" />
        <rect width="2964" height="2100" fill="#3c3b6e" />
        <circle cx="1482" cy="1050" r="700" fill="#ffffff" opacity="0.9" />
        <rect x="800" y="550" width="1364" height="1000" fill="#3c3b6e" />
        <polygon points="1482,750 1542,934 1736,934 1579,1048 1638,1232 1482,1118 1326,1232 1385,1048 1228,934 1422,934" fill="#ffffff" />
      </svg>
    );
  }
  if (c === 'JP' || c === 'JAPAN' || c === 'JAPON') {
    return (
      <svg style={style} viewBox="0 0 900 600">
        <rect width="900" height="600" fill="#ffffff" />
        <circle cx="450" cy="300" r="180" fill="#bc002d" />
      </svg>
    );
  }
  if (c === 'EU' || c === 'EUR' || c === 'EUROPE') {
    return (
      <svg style={style} viewBox="0 0 810 540">
        <rect width="810" height="540" fill="#003399" />
        <circle cx="405" cy="270" r="140" fill="none" stroke="#ffcc00" strokeWidth="18" strokeDasharray="1 72" />
      </svg>
    );
  }
  if (c === 'GB' || c === 'GBP' || c === 'UK') {
    return (
      <svg style={style} viewBox="0 0 60 30">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="3" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </svg>
    );
  }
  if (c === 'CA' || c === 'CANADA') {
    return (
      <svg style={style} viewBox="0 0 900 450">
        <rect width="225" height="450" fill="#ff0000" />
        <rect x="225" width="450" height="450" fill="#ffffff" />
        <rect x="675" width="225" height="450" fill="#ff0000" />
        <polygon points="450,110 468,180 520,165 490,215 540,240 480,270 485,340 450,305 415,340 420,270 360,240 410,215 380,165 432,180" fill="#ff0000" />
      </svg>
    );
  }
  if (c === 'BR' || c === 'BRAZIL' || c === 'BRÉSIL') {
    return (
      <svg style={style} viewBox="0 0 720 504">
        <rect width="720" height="504" fill="#009c3b" />
        <polygon points="360,42 660,252 360,462 60,252" fill="#ffdf00" />
        <circle cx="360" cy="252" r="105" fill="#002776" />
      </svg>
    );
  }
  if (c === 'AE' || c === 'UAE') {
    return (
      <svg style={style} viewBox="0 0 600 300">
        <rect width="600" height="100" fill="#00732f" />
        <rect y="100" width="600" height="100" fill="#ffffff" />
        <rect y="200" width="600" height="100" fill="#000000" />
        <rect width="150" height="300" fill="#ff0000" />
      </svg>
    );
  }
  if (c === 'AU' || c === 'AUSTRALIA' || c === 'AUSTRALIE') {
    return (
      <svg style={style} viewBox="0 0 600 300">
        <rect width="600" height="300" fill="#00008b" />
        <circle cx="450" cy="150" r="18" fill="#ffffff" />
        <circle cx="480" cy="90" r="14" fill="#ffffff" />
        <circle cx="510" cy="140" r="14" fill="#ffffff" />
        <circle cx="475" cy="210" r="14" fill="#ffffff" />
        <circle cx="150" cy="210" r="28" fill="#ffffff" />
      </svg>
    );
  }
  return <span style={{ fontSize: '1rem', marginRight: 4 }}>🌐</span>;
}

/* ── 3D Glowing Digital Holographic Earth Canvas ──────── */
function HolographicGlobe({ onSelectMorocco }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let rotation = 0;

    const width = (canvas.width = 460);
    const height = (canvas.height = 460);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 175;

    // Point cloud
    const dots = [];
    const numPoints = 720;
    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;
      dots.push({
        x0: Math.cos(theta) * Math.sin(phi),
        y0: Math.sin(theta) * Math.sin(phi),
        z0: Math.cos(phi),
        baseSize: Math.random() * 1.6 + 1
      });
    }

    // Satellite orbits
    const orbits = [
      { tilt: -0.38, speed: 0.014, angle: 0, r: radius + 28, color: '#38bdf8' },
      { tilt: 0.44, speed: -0.011, angle: Math.PI / 2, r: radius + 42, color: '#06b6d4' }
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep blue outer atmosphere halo
      const radialAtmosphere = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.7,
        centerX,
        centerY,
        radius * 1.38
      );
      radialAtmosphere.addColorStop(0, 'rgba(14, 165, 233, 0.22)');
      radialAtmosphere.addColorStop(0.5, 'rgba(6, 182, 212, 0.12)');
      radialAtmosphere.addColorStop(0.8, 'rgba(56, 189, 248, 0.05)');
      radialAtmosphere.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = radialAtmosphere;
      ctx.fillRect(0, 0, width, height);

      // Earth sphere base with internal glowing darkness
      const sphereGrad = ctx.createRadialGradient(
        centerX - radius * 0.35,
        centerY - radius * 0.35,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      sphereGrad.addColorStop(0, '#0c2647');
      sphereGrad.addColorStop(0.45, '#07182e');
      sphereGrad.addColorStop(0.85, '#040d1a');
      sphereGrad.addColorStop(1, '#020617');

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      // Atmospheric glowing rim stroke
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 2.4;
      ctx.shadowColor = '#00d2ff';
      ctx.shadowBlur = 24;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Latitude Parallels
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      for (let lat = -60; lat <= 60; lat += 30) {
        const rad = (lat * Math.PI) / 180;
        const rLat = radius * Math.cos(rad);
        const yLat = centerY + radius * Math.sin(rad) * 0.35;
        ctx.beginPath();
        ctx.ellipse(centerX, yLat, rLat, rLat * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Meridians rotating
      rotation += 0.007;
      for (let lon = 0; lon < 6; lon++) {
        const angle = rotation + (lon * Math.PI) / 3;
        const xOffset = Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          Math.abs(xOffset),
          radius,
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle =
          Math.cos(angle) > 0
            ? 'rgba(56, 189, 248, 0.25)'
            : 'rgba(56, 189, 248, 0.06)';
        ctx.stroke();
      }

      // Continents Holographic Dot Cloud
      const cosR = Math.cos(rotation);
      const sinR = Math.sin(rotation);

      dots.forEach((dot) => {
        const x = dot.x0 * cosR - dot.z0 * sinR;
        const z = dot.x0 * sinR + dot.z0 * cosR;
        const y = dot.y0;

        if (z > -0.2) {
          const screenX = centerX + x * radius;
          const screenY = centerY + y * radius;
          const alpha = (z + 0.2) / 1.2;

          ctx.beginPath();
          ctx.arc(screenX, screenY, dot.baseSize * (0.8 + z * 0.4), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${Math.min(1, alpha * 0.95)})`;
          ctx.fill();
        }
      });

      // Orbital satellite lines
      orbits.forEach((orb) => {
        orb.angle += orb.speed;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(orb.tilt);

        ctx.beginPath();
        ctx.ellipse(0, 0, orb.r, orb.r * 0.34, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Satellite beacon
        const satX = Math.cos(orb.angle) * orb.r;
        const satY = Math.sin(orb.angle) * (orb.r * 0.34);

        ctx.beginPath();
        ctx.arc(satX, satY, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = orb.color;
        ctx.shadowColor = orb.color;
        ctx.shadowBlur = 12;
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="hero-globe-wrapper">
      <canvas ref={canvasRef} className="hero-globe-canvas" />

      {/* Floating Holographic Country Card: Morocco */}
      <div className="hero-floating-card" onClick={onSelectMorocco}>
        <div className="card-flag-header">
          <FlagIcon country="MA" width={22} height={15} />
          <span className="country-name-hero">Morocco</span>
        </div>
        <div className="card-info-row">
          <span className="info-label">Capitale</span>
          <span className="info-value">Rabat</span>
        </div>
        <div className="card-info-row">
          <span className="info-label">Population</span>
          <span className="info-value">37,8 M</span>
        </div>
        <div className="card-info-row">
          <span className="info-label">Devise</span>
          <span className="info-value">MAD</span>
        </div>
        <button className="card-action-link" onClick={onSelectMorocco}>
          <span>Voir le pays</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <p className="hero-globe-quote">Plus qu'une carte, une vision du monde.</p>
    </div>
  );
}

/* ── World Pinpoints ─────────────── */
const MAP_PINS = [
  { id: 'ca', name: 'Canada', x: 20, y: 30, code: 'CA', cap: 'Ottawa', pop: '38,9 M', cur: 'CAD' },
  { id: 'us', name: 'États-Unis', x: 22, y: 44, code: 'US', cap: 'Washington', pop: '340 M', cur: 'USD' },
  { id: 'br', name: 'Brésil', x: 31, y: 70, code: 'BR', cap: 'Brasília', pop: '215 M', cur: 'BRL' },
  { id: 'eu', name: 'Europe', x: 50, y: 35, code: 'FR', cap: 'Paris / Bruxelles', pop: '448 M', cur: 'EUR' },
  { id: 'ma', name: 'Maroc', x: 47, y: 47, code: 'MA', cap: 'Rabat', pop: '37,8 M', cur: 'MAD' },
  { id: 'uae', name: 'UAE', x: 62, y: 52, code: 'AE', cap: 'Abu Dhabi', pop: '10 M', cur: 'AED' },
  { id: 'jp', name: 'Japon', x: 84, y: 42, code: 'JP', cap: 'Tokyo', pop: '123 M', cur: 'JPY' },
  { id: 'au', name: 'Australie', x: 86, y: 78, code: 'AU', cap: 'Canberra', pop: '26 M', cur: 'AUD' }
];

export default function LandingPage({
  onNavigateToDashboard,
  onNavigateToSignIn,
  onNavigateToMap,
  onSelectCountry
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState(MAP_PINS.find(p => p.id === 'ma'));

  // World AI Interactive chat
  const [userQuery, setUserQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'user',
      text: 'Quelle est la capitale du Maroc ?'
    },
    {
      type: 'ai',
      text: 'La capitale du Maroc est Rabat. Rabat est la capitale politique du pays, tandis que Marrakech est la capitale touristique.',
      time: "Aujourd'hui - 14:32"
    }
  ]);

  // News active tab
  const [newsFilter, setNewsFilter] = useState('Tous');

  // Forex rates
  const [rates, setRates] = useState([
    { pair: 'USD → MAD', flagCode: 'US', symbol: '$', rate: '10,72 MAD', change: '+0,12%', path: 'M0,18 Q15,8 30,14 T60,5 T90,2' },
    { pair: 'EUR → MAD', flagCode: 'EU', symbol: '€', rate: '12,48 MAD', change: '+0,08%', path: 'M0,16 Q15,19 30,12 T60,8 T90,3' },
    { pair: 'GBP → MAD', flagCode: 'GB', symbol: '£', rate: '14,52 MAD', change: '+0,10%', path: 'M0,17 Q15,12 30,15 T60,6 T90,1' }
  ]);

  // Fetch live ticker
  useEffect(() => {
    async function loadRates() {
      try {
        const live = await fetchLiveTickerRates();
        if (live && live.rates) {
          const usdMad = live.rates.MAD;
          const eurMad = live.rates.EUR ? (live.rates.MAD / live.rates.EUR).toFixed(2) : '12,48';
          const gbpMad = live.rates.GBP ? (live.rates.MAD / live.rates.GBP).toFixed(2) : '14,52';
          if (usdMad) {
            setRates([
              { pair: 'USD → MAD', flagCode: 'US', symbol: '$', rate: `${usdMad.toFixed(2)} MAD`, change: '+0,12%', path: 'M0,18 Q15,8 30,14 T60,5 T90,2' },
              { pair: 'EUR → MAD', flagCode: 'EU', symbol: '€', rate: `${eurMad} MAD`, change: '+0,08%', path: 'M0,16 Q15,19 30,12 T60,8 T90,3' },
              { pair: 'GBP → MAD', flagCode: 'GB', symbol: '£', rate: `${gbpMad} MAD`, change: '+0,10%', path: 'M0,17 Q15,12 30,15 T60,6 T90,1' }
            ]);
          }
        }
      } catch {
        // Fallback
      }
    }
    loadRates();
  }, []);

  const handleCountryClick = (code) => {
    const found = COUNTRIES.find(c => c.code === code) || COUNTRIES[0];
    if (onSelectCountry) {
      onSelectCountry(found);
    } else {
      onNavigateToDashboard();
    }
  };

  const handleSendChat = (text) => {
    const q = text || userQuery;
    if (!q.trim()) return;

    const newMsgs = [
      ...chatMessages,
      { type: 'user', text: q }
    ];
    setChatMessages(newMsgs);
    setUserQuery('');

    setTimeout(() => {
      let reply = "World AI analyse les données géopolitiques et économiques mondiales pour ce pays.";
      if (q.toLowerCase().includes('change') || q.toLowerCase().includes('devise')) {
        reply = "La devise officielle du Maroc est le Dirham Marocain (MAD). Le taux actuel est d'environ 1 USD = 10,72 MAD.";
      } else if (q.toLowerCase().includes('population')) {
        reply = "La population du Maroc est estimée à 37,8 millions d'habitants avec une dynamique démographique active.";
      } else if (q.toLowerCase().includes('actualité') || q.toLowerCase().includes('nouvelle')) {
        reply = "Le Maroc accélère actuellement ses investissements dans les énergies renouvelables et l'industrie automobile verte.";
      }
      setChatMessages([
        ...newMsgs,
        {
          type: 'ai',
          text: reply,
          time: "À l'instant"
        }
      ]);
    }, 550);
  };

  const filteredSearchCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 6);

  return (
    <div className="mock-landing-container" id="hero">
      {/* ── 1. HERO SECTION ───────────────────────────────────── */}
      <section className="mock-hero-section">
        <div className="mock-hero-left">
          {/* Badge */}
          <div className="mock-badge">
            <span className="mock-badge-dot"></span>
            <span>INFORMATIONS EN TEMPS RÉEL</span>
          </div>

          {/* Display Heading */}
          <h1 className="mock-hero-title">
            Le monde.<br />
            Toutes les informations.<br />
            <span className="cyan-highlight">Un seul endroit.</span>
          </h1>

          {/* Subtitle */}
          <p className="mock-hero-desc">
            Explorez les informations essentielles de chaque pays : capitale, population, taux de change, actualités récentes... Le tout enrichi par une IA dédiée.
          </p>

          {/* Search bar */}
          <div className="mock-search-wrapper">
            <div className="mock-search-bar">
              <Search size={18} className="mock-search-icon" />
              <input
                type="text"
                placeholder="Rechercher un pays..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredSearchCountries[0]) {
                    handleCountryClick(filteredSearchCountries[0].code);
                  }
                }}
                onFocus={() => setSearchOpen(true)}
              />
              <button
                className="mock-search-btn"
                onClick={() => {
                  if (filteredSearchCountries[0]) {
                    handleCountryClick(filteredSearchCountries[0].code);
                  } else {
                    onNavigateToDashboard();
                  }
                }}
              >
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Dropdown list */}
            {searchOpen && searchQuery && (
              <div className="mock-search-dropdown">
                {filteredSearchCountries.map((c) => (
                  <div
                    key={c.code}
                    className="mock-search-item"
                    onClick={() => {
                      handleCountryClick(c.code);
                      setSearchOpen(false);
                    }}
                  >
                    <FlagIcon country={c.code} width={24} height={16} />
                    <div className="mock-search-text">
                      <strong>{c.name}</strong>
                      <span>Cap: {c.capital} • {c.currency}</span>
                    </div>
                    <ArrowRight size={14} color="#06b6d4" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pays populaires */}
          <div className="mock-popular-row">
            <span className="popular-label">Pays populaires :</span>
            <button className="popular-pill" onClick={() => handleCountryClick('MA')}>
              <FlagIcon country="MA" width={18} height={12} />
              <span>Maroc</span>
            </button>
            <button className="popular-pill" onClick={() => handleCountryClick('FR')}>
              <FlagIcon country="FR" width={18} height={12} />
              <span>France</span>
            </button>
            <button className="popular-pill" onClick={() => handleCountryClick('US')}>
              <FlagIcon country="US" width={18} height={12} />
              <span>États-Unis</span>
            </button>
            <button className="popular-pill" onClick={() => handleCountryClick('JP')}>
              <FlagIcon country="JP" width={18} height={12} />
              <span>Japon</span>
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="mock-cta-group">
            <button className="mock-btn-primary" onClick={onNavigateToDashboard}>
              <span>Explorer les pays</span>
              <ArrowRight size={16} />
            </button>
            <button
              className="mock-btn-secondary"
              onClick={() => {
                document.getElementById('world-ai')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Bot size={17} color="#38bdf8" />
              <span>Ask World AI</span>
            </button>
          </div>
        </div>

        {/* Hero Right Holographic Globe */}
        <div className="mock-hero-right">
          <HolographicGlobe onSelectMorocco={() => handleCountryClick('MA')} />
        </div>
      </section>

      {/* ── 2. SECTION: EXPLORE LE MONDE ──────────────────────── */}
      <section className="mock-section" id="explore-monde">
        <div className="mock-section-header">
          <div className="section-title-wrapper">
            <div className="section-icon-circle">
              <Globe size={22} color="#38bdf8" />
            </div>
            <div>
              <h2 className="mock-section-title">Explore le monde</h2>
              <p className="mock-section-subtitle">Sélectionnez un pays pour découvrir ses informations en temps réel.</p>
            </div>
          </div>
        </div>

        <div className="explore-layout-grid">
          {/* Left: Interactive Map Container */}
          <div className="explore-map-card">
            {/* Map Controls */}
            <div className="map-zoom-controls">
              <button title="Zoomer"><Plus size={16} /></button>
              <button title="Dézoomer"><Minus size={16} /></button>
              <button title="Recentrer"><Crosshair size={16} /></button>
            </div>

            {/* Dark Styled World Map with Pins */}
            <div className="explore-map-canvas">
              {/* High-Fidelity Continents Contours */}
              <svg className="world-svg-base" viewBox="0 0 1000 500" fill="none" preserveAspectRatio="none">
                <defs>
                  <pattern id="dotPattern" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.1" fill="rgba(56, 189, 248, 0.12)" />
                  </pattern>
                </defs>
                {/* Dot background */}
                <rect width="1000" height="500" fill="url(#dotPattern)" />

                {/* North America */}
                <path d="M70,80 Q130,50 200,60 T310,110 T300,190 T240,230 T170,260 T140,230 T110,150 Z" fill="#0d1b2e" stroke="#1c3554" strokeWidth="1.2" />
                {/* South America */}
                <path d="M210,270 Q280,270 320,330 T280,450 T220,460 T190,380 T190,310 Z" fill="#0d1b2e" stroke="#1c3554" strokeWidth="1.2" />
                {/* Europe */}
                <path d="M440,70 Q510,60 550,110 T520,180 T450,170 T420,110 Z" fill="#0d1b2e" stroke="#1c3554" strokeWidth="1.2" />
                {/* Africa */}
                <path d="M420,190 Q510,180 550,250 T530,390 T470,430 T420,340 T390,240 Z" fill="#0d1b2e" stroke="#1c3554" strokeWidth="1.2" />
                {/* Asia */}
                <path d="M550,70 Q750,50 890,100 T870,240 T740,290 T630,280 T560,180 Z" fill="#0d1b2e" stroke="#1c3554" strokeWidth="1.2" />
                {/* Australia */}
                <path d="M760,330 Q860,320 890,380 T840,460 T760,440 T730,380 Z" fill="#0d1b2e" stroke="#1c3554" strokeWidth="1.2" />
              </svg>

              {/* Pinpoints matching mockup */}
              {MAP_PINS.map((pin) => {
                const isSelected = selectedPin.id === pin.id;
                return (
                  <div
                    key={pin.id}
                    className={`map-pinpoint-node ${isSelected ? 'active' : ''}`}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    onClick={() => setSelectedPin(pin)}
                  >
                    <div className="pinpoint-marker">
                      <div className="pinpoint-core"></div>
                      {isSelected && <div className="pinpoint-radar"></div>}
                    </div>
                    <span className="pinpoint-label">{pin.id === 'ma' ? '◆ Maroc' : pin.name}</span>
                  </div>
                );
              })}

              {/* Active Popup Card */}
              <div
                className="map-floating-popup"
                style={{
                  left: `${Math.min(75, Math.max(22, selectedPin.x - 4))}%`,
                  top: `${Math.min(68, selectedPin.y + 10)}%`
                }}
              >
                <div className="popup-header">
                  <FlagIcon country={selectedPin.code} width={20} height={14} />
                  <span className="popup-title">{selectedPin.name}</span>
                </div>
                <div className="popup-row">
                  <span>Capitale</span>
                  <strong>{selectedPin.cap}</strong>
                </div>
                <div className="popup-row">
                  <span>Population</span>
                  <strong>{selectedPin.pop}</strong>
                </div>
                <div className="popup-row">
                  <span>Devise</span>
                  <strong>{selectedPin.cur}</strong>
                </div>
                <button
                  className="popup-btn"
                  onClick={() => handleCountryClick(selectedPin.code)}
                >
                  <span>Voir le pays</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Pays populaires grid */}
          <div className="explore-popular-panel">
            <div className="popular-panel-header">
              <h3>Pays populaires</h3>
              <button className="view-all-link" onClick={onNavigateToDashboard}>
                Voir tous →
              </button>
            </div>

            <div className="popular-grid-2x2">
              {/* 1. Maroc */}
              <div className="popular-card" onClick={() => handleCountryClick('MA')}>
                <div className="card-top">
                  <FlagIcon country="MA" width={32} height={22} radius={4} />
                  <div className="card-arrow-icon"><ArrowRight size={15} /></div>
                </div>
                <div className="card-body">
                  <h4>Maroc</h4>
                  <p>Rabat · 37,8 M</p>
                  <span className="card-curr-badge">MAD</span>
                </div>
              </div>

              {/* 2. France */}
              <div className="popular-card" onClick={() => handleCountryClick('FR')}>
                <div className="card-top">
                  <FlagIcon country="FR" width={32} height={22} radius={4} />
                  <div className="card-arrow-icon"><ArrowRight size={15} /></div>
                </div>
                <div className="card-body">
                  <h4>France</h4>
                  <p>Paris · 68,4 M</p>
                  <span className="card-curr-badge">EUR</span>
                </div>
              </div>

              {/* 3. États-Unis */}
              <div className="popular-card" onClick={() => handleCountryClick('US')}>
                <div className="card-top">
                  <FlagIcon country="US" width={32} height={22} radius={4} />
                  <div className="card-arrow-icon"><ArrowRight size={15} /></div>
                </div>
                <div className="card-body">
                  <h4>États-Unis</h4>
                  <p>Washington · 340 M</p>
                  <span className="card-curr-badge">USD</span>
                </div>
              </div>

              {/* 4. Japon */}
              <div className="popular-card" onClick={() => handleCountryClick('JP')}>
                <div className="card-top">
                  <FlagIcon country="JP" width={32} height={22} radius={4} />
                  <div className="card-arrow-icon"><ArrowRight size={15} /></div>
                </div>
                <div className="card-body">
                  <h4>Japon</h4>
                  <p>Tokyo · 123 M</p>
                  <span className="card-curr-badge">JPY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. SECTION: WORLD AI & TAUX DE CHANGE ─────────────── */}
      <section className="mock-section" id="world-ai">
        <div className="ai-forex-split-grid">
          {/* Left Card: World AI */}
          <div className="mock-card-ai">
            <div className="card-ai-header">
              <div className="ai-header-icon">
                <Bot size={24} color="#38bdf8" />
              </div>
              <div>
                <h3>World AI</h3>
                <p>Posez toutes vos questions sur un pays.</p>
              </div>
            </div>

            <div className="ai-content-inner">
              {/* Chat simulation side */}
              <div className="ai-chat-column">
                <div className="chat-stream-box">
                  {chatMessages.map((m, idx) => (
                    <div key={idx} className={`chat-bubble-row ${m.type}`}>
                      {m.type === 'ai' && (
                        <div className="ai-avatar-badge">
                          <Bot size={14} color="#38bdf8" />
                        </div>
                      )}
                      <div className="bubble-text">
                        <p>{m.text}</p>
                        {m.time && <span className="bubble-time">{m.time}</span>}
                      </div>
                      {m.type === 'user' && (
                        <div className="user-icon-tiny">
                          <ArrowRight size={12} color="#94a3b8" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="chat-input-bar">
                  <input
                    type="text"
                    placeholder="Posez votre question..."
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  />
                  <button className="chat-send-btn" onClick={() => handleSendChat()}>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>

              {/* Suggested Questions side */}
              <div className="ai-suggestions-column">
                <h4>Questions suggérées</h4>
                <div className="suggestions-list">
                  <button
                    className="suggestion-pill-item"
                    onClick={() => handleSendChat('Quel est le taux de change ?')}
                  >
                    <span>Quel est le taux de change ?</span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    className="suggestion-pill-item"
                    onClick={() => handleSendChat('Quelle est la population ?')}
                  >
                    <span>Quelle est la population ?</span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    className="suggestion-pill-item"
                    onClick={() => handleSendChat('Quelles sont les dernières actualités ?')}
                  >
                    <span>Quelles sont les dernières actualités ?</span>
                    <ArrowRight size={13} />
                  </button>
                  <button
                    className="suggestion-pill-item"
                    onClick={() => handleSendChat('Quelle est la devise utilisée ?')}
                  >
                    <span>Quelle est la devise utilisée ?</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <button className="btn-start-conversation" onClick={onNavigateToDashboard}>
                  <span>Démarrer une conversation</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Card: Taux de change en direct */}
          <div className="mock-card-forex">
            <div className="forex-header">
              <div className="forex-title-group">
                <div className="forex-icon-circle">
                  <TrendingUp size={19} color="#38bdf8" />
                </div>
                <h3>Taux de change en direct</h3>
              </div>
              <button className="view-all-link" onClick={onNavigateToDashboard}>
                Voir tous →
              </button>
            </div>

            <div className="forex-rates-list">
              {rates.map((r, i) => (
                <div key={i} className="forex-rate-row" onClick={onNavigateToDashboard}>
                  <div className="rate-pair-left">
                    <FlagIcon country={r.flagCode} width={30} height={20} radius={3} />
                    <div>
                      <div className="rate-pair-title">{r.pair}</div>
                      <div className="rate-main-value">
                        {r.symbol}1 = {r.rate}
                      </div>
                    </div>
                  </div>

                  <div className="rate-trend-right">
                    <span className="rate-change-badge">{r.change}</span>
                    <svg className="sparkline-svg" width="90" height="24" viewBox="0 0 90 24">
                      <path
                        d={r.path}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <div className="forex-footer-status">
              <span className="green-pulse-dot"></span>
              <span>Mis à jour il y a 2 min</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. SECTION: DERNIÈRES ACTUALITÉS ─────────────────── */}
      <section className="mock-section" id="dernieres-actualites">
        <div className="mock-section-header actualites-header">
          <div className="section-title-wrapper">
            <div className="section-icon-circle">
              <Newspaper size={22} color="#38bdf8" />
            </div>
            <div>
              <h2 className="mock-section-title">Dernières actualités</h2>
              <p className="mock-section-subtitle">Restez informé des événements qui façonnent le monde.</p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="news-filter-pills">
            {['Tous', 'Politique', 'Économie', 'Technologie', 'Sport', 'Monde'].map((cat) => (
              <button
                key={cat}
                className={`news-cat-pill ${newsFilter === cat ? 'active' : ''}`}
                onClick={() => setNewsFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4 News Cards Grid matching mockup */}
        <div className="news-cards-grid">
          {/* Card 1: Maroc */}
          <div className="news-card" onClick={() => handleCountryClick('MA')}>
            <div className="news-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1509233631037-deb7efd36207?w=600&auto=format&fit=crop&q=80"
                alt="Maroc"
                className="news-image"
              />
              <span className="news-badge-overlay">
                <FlagIcon country="MA" width={14} height={10} /> Maroc · Il y a 2h
              </span>
            </div>
            <div className="news-content">
              <h3>Le Maroc annonce un nouveau plan de développement économique</h3>
              <button className="news-read-link">
                <span>Lire l'article</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Card 2: France */}
          <div className="news-card" onClick={() => handleCountryClick('FR')}>
            <div className="news-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80"
                alt="France"
                className="news-image"
              />
              <span className="news-badge-overlay">
                <FlagIcon country="FR" width={14} height={10} /> France · Il y a 3h
              </span>
            </div>
            <div className="news-content">
              <h3>La France renforce sa coopération européenne sur l'énergie</h3>
              <button className="news-read-link">
                <span>Lire l'article</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Card 3: États-Unis */}
          <div className="news-card" onClick={() => handleCountryClick('US')}>
            <div className="news-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=600&auto=format&fit=crop&q=80"
                alt="États-Unis"
                className="news-image"
              />
              <span className="news-badge-overlay">
                <FlagIcon country="US" width={14} height={10} /> États-Unis · Il y a 5h
              </span>
            </div>
            <div className="news-content">
              <h3>Les États-Unis annoncent de nouvelles mesures pour l'innovation</h3>
              <button className="news-read-link">
                <span>Lire l'article</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Card 4: Japon */}
          <div className="news-card" onClick={() => handleCountryClick('JP')}>
            <div className="news-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1578637387939-43c525550085?w=600&auto=format&fit=crop&q=80"
                alt="Japon"
                className="news-image"
              />
              <span className="news-badge-overlay">
                <FlagIcon country="JP" width={14} height={10} /> Japon · Il y a 6h
              </span>
            </div>
            <div className="news-content">
              <h3>Le Japon mise sur la transition verte pour 2050</h3>
              <button className="news-read-link">
                <span>Lire l'article</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SECTION: CTA BANNER HORIZON ────────────────────── */}
      <section className="mock-cta-banner">
        <div className="banner-horizon-glow"></div>
        <div className="banner-inner-content">
          <div className="banner-earth-image"></div>
          <div className="banner-left">
            <div className="banner-title-row">
              <div className="banner-compass-icon">
                <Compass size={22} color="#38bdf8" />
              </div>
              <h2>Découvrez le monde autrement.</h2>
            </div>

            <div className="banner-features-row">
              <div className="feature-item">
                <div className="feature-icon"><FileText size={15} /></div>
                <span>Toutes les données essentielles des pays.</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Newspaper size={15} /></div>
                <span>Toutes les actualités importantes.</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon"><Bot size={15} /></div>
                <span>Une IA pour répondre à vos questions.</span>
              </div>
            </div>
          </div>

          <button className="banner-cta-btn" onClick={onNavigateToDashboard}>
            <span>Commencer maintenant</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── 6. FOOTER ─────────────────────────────────────────── */}
      <footer className="mock-footer">
        <div className="footer-top-row">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="16" fill="url(#footerGlow)" stroke="#06b6d4" strokeWidth="1.5" />
                <path d="M10 12L14 24L18 16L22 24L26 12" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="18" cy="17" r="4" fill="#06b6d4" fillOpacity="0.4" stroke="#22d3ee" strokeWidth="1" />
                <defs>
                  <radialGradient id="footerGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                    <stop offset="0%" stopColor="#0891b2" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0a192f" stopOpacity="0.9" />
                  </radialGradient>
                </defs>
              </svg>
              <span className="footer-brand-title">
                <strong>World</strong> <span style={{ color: '#38bdf8' }}>Watch</span>
              </span>
            </div>
            <p className="footer-slogan">Un monde d'infos, en un clic.</p>
          </div>

          <div className="footer-links">
            <a href="#hero" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Accueil</a>
            <a href="#explore-monde" onClick={(e) => { e.preventDefault(); document.getElementById('explore-monde')?.scrollIntoView({ behavior: 'smooth' }); }}>Explorer</a>
            <a onClick={onNavigateToDashboard}>Pays</a>
            <a href="#dernieres-actualites" onClick={(e) => { e.preventDefault(); document.getElementById('dernieres-actualites')?.scrollIntoView({ behavior: 'smooth' }); }}>Actualités</a>
            <a onClick={onNavigateToDashboard}>Favoris</a>
          </div>

          <div className="footer-socials">
            {/* X / Twitter */}
            <a href="https://x.com" target="_blank" rel="noreferrer" title="X">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noreferrer" title="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" title="LinkedIn">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2m1.4 9.74v-8.37H5.06v8.37z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-bottom-row">
          <p>© 2025 World Watch. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
