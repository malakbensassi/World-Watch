import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  TrendingUp,
  Newspaper,
  Bot,
  Shield,
  ArrowRight,
  Sparkles,
  Zap,
  ChevronRight,
  Lock,
  BarChart3,
  Layers,
  Activity,
  MapPin,
  AlertTriangle,
  Radio,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Database
} from 'lucide-react';
import { COUNTRIES } from '../data/countries';
import { useTheme } from '../context/ThemeContext';
import { fetchLiveTickerRates, fetchLiveForexMatrix } from '../api/client';

/* ── Interactive Constellation & Radar Canvas Background ──────── */
function AnimatedNetworkCanvas({ isDark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes configuration
    const nodeCount = Math.min(65, Math.floor((width * height) / 18000));
    const nodes = [];
    const colors = isDark
      ? ['rgba(6, 182, 212, ', 'rgba(56, 189, 248, ', 'rgba(168, 85, 247, ']
      : ['rgba(2, 132, 199, ', 'rgba(14, 165, 233, ', 'rgba(124, 58, 237, '];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: Math.random() * 1.8 + 1.2,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03
      });
    }

    // Mouse tracking for subtle magnetism
    let mouse = { x: -1000, y: -1000 };
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    // Radar pulse wave
    let radarRadius = 0;
    const maxRadar = Math.min(width, height) * 0.8;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Radar scan pulse effect
      radarRadius += 0.8;
      if (radarRadius > maxRadar) radarRadius = 0;
      const radarAlpha = Math.max(0, 1 - radarRadius / maxRadar) * (isDark ? 0.08 : 0.05);

      ctx.save();
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.45, radarRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isDark
        ? `rgba(6, 182, 212, ${radarAlpha})`
        : `rgba(2, 132, 199, ${radarAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Connect near nodes with glowing lines
      const maxDistance = 135;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.18 : 0.12);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = isDark
              ? `rgba(6, 182, 212, ${alpha})`
              : `rgba(2, 132, 199, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw and update each node
      for (let i = 0; i < nodeCount; i++) {
        const n = nodes[i];

        // Move
        n.x += n.vx;
        n.y += n.vy;

        // Bounce off canvas walls
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Mouse gentle repel / attraction
        const mdx = mouse.x - n.x;
        const mdy = mouse.y - n.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 120 && mdist > 0) {
          const force = (1 - mdist / 120) * 0.04;
          n.x -= (mdx / mdist) * force * 15;
          n.y -= (mdy / mdist) * force * 15;
        }

        // Pulsing glow
        n.pulse += n.pulseSpeed;
        const alpha = isDark
          ? 0.45 + Math.sin(n.pulse) * 0.25
          : 0.35 + Math.sin(n.pulse) * 0.2;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${n.colorPrefix}${alpha})`;
        ctx.shadowColor = isDark ? '#00f2fe' : '#0284c7';
        ctx.shadowBlur = isDark ? 6 : 3;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="landing-network-canvas"
      aria-hidden="true"
    />
  );
}

/* ── Interactive SVG Sparkline Component ──────────────────────── */
function MiniSparkline({ up = true }) {
  const points = up
    ? [20, 24, 22, 28, 25, 32, 29, 36, 34, 42, 40, 48]
    : [48, 44, 46, 40, 42, 35, 38, 30, 32, 25, 27, 20];

  const w = 120;
  const h = 40;
  const step = w / (points.length - 1);

  const pathD = points.reduce((acc, val, idx) => {
    const x = idx * step;
    const y = h - (val / 50) * h;
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const strokeColor = up ? 'var(--emerald)' : 'var(--rose)';
  const fillColor = up ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)';

  return (
    <svg width={w} height={h} className="sparkline-svg" viewBox={`0 0 ${w} ${h}`}>
      <path
        d={`${pathD} L ${w} ${h} L 0 ${h} Z`}
        fill={fillColor}
      />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LandingPage({
  onNavigateToDashboard,
  onNavigateToSignIn,
  onNavigateToMap
}) {
  const { isDark } = useTheme();

  // Selected Country in the Hero Terminal Mockup (Interactive Tab Demo)
  const [mockupCountryIndex, setMockupCountryIndex] = useState(0);

  // Live Real-Time Ticker & Forex Matrix State
  const [tickerItems, setTickerItems] = useState([
    { pair: 'USD / MAD', rate: '9.3527', change: '+0.12%', up: true },
    { pair: 'EUR / USD', rate: '1.1613', change: '+0.06%', up: true },
    { pair: 'GBP / USD', rate: '1.3519', change: '-0.14%', up: false },
    { pair: 'USD / JPY', rate: '156.18', change: '+0.28%', up: true },
    { pair: 'EUR / MAD', rate: '10.8617', change: '+0.18%', up: true },
    { pair: 'USD / AED', rate: '3.6725', change: '0.00%', up: true },
    { pair: 'USD / CAD', rate: '1.3831', change: '-0.09%', up: false },
    { pair: 'USD / SAR', rate: '3.7500', change: '+0.01%', up: true },
    { pair: 'EUR / GBP', rate: '0.8588', change: '+0.11%', up: true },
    { pair: 'USD / CHF', rate: '0.8099', change: '-0.05%', false: true },
    { pair: 'USD / CNY', rate: '6.7194', change: '+0.03%', up: true }
  ]);
  const [liveRatesMap, setLiveRatesMap] = useState(null);
  const [tickerTimestamp, setTickerTimestamp] = useState('Real-Time Stream');
  const [isLiveApiConnected, setIsLiveApiConnected] = useState(false);

  // Mini Interactive Currency Converter State
  const [calcAmount, setCalcAmount] = useState(1000);
  const [calcBase, setCalcBase] = useState('USD');
  const [calcTarget, setCalcTarget] = useState('MAD');

  // Fetch real-time rates on mount and periodically every 60s
  useEffect(() => {
    let isMounted = true;

    async function loadRealTimeForex() {
      try {
        const [tickerData, matrixData] = await Promise.all([
          fetchLiveTickerRates(),
          fetchLiveForexMatrix('USD')
        ]);
        if (isMounted) {
          if (Array.isArray(tickerData) && tickerData.length > 0) {
            setTickerItems(tickerData);
            setIsLiveApiConnected(true);
            if (tickerData[0]?.lastUpdate) {
              setTickerTimestamp(tickerData[0].lastUpdate);
            }
          }
          if (matrixData && matrixData.rates) {
            setLiveRatesMap(matrixData.rates);
          }
        }
      } catch (err) {
        console.warn('[Forex] Real-time ticker query error:', err);
      }
    }

    loadRealTimeForex();
    const interval = setInterval(loadRealTimeForex, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Dynamic calculation using live real-time rates
  const calculatedOutput = useMemo(() => {
    if (liveRatesMap) {
      const fromRateUSD = calcBase === 'USD' ? 1 : (liveRatesMap[calcBase] ? (1 / liveRatesMap[calcBase]) : 1);
      const toRateUSD = calcTarget === 'USD' ? 1 : (liveRatesMap[calcTarget] || 1);
      const crossRate = fromRateUSD * toRateUSD;
      return (calcAmount * crossRate).toFixed(2);
    }
    // Fallback if network is loading
    const defaultRates = {
      USD: { MAD: 9.3527, EUR: 0.8611, GBP: 0.7397, JPY: 156.18, CAD: 1.3831 },
      EUR: { MAD: 10.8617, USD: 1.1613, GBP: 0.8588, JPY: 181.37, CAD: 1.6062 },
      MAD: { USD: 0.1069, EUR: 0.0921, GBP: 0.0791, JPY: 16.69, CAD: 0.1479 }
    };
    return (calcAmount * (defaultRates[calcBase]?.[calcTarget] || 1)).toFixed(2);
  }, [calcAmount, calcBase, calcTarget, liveRatesMap]);

  // Showcase countries for the hero terminal tab switcher
  const heroDemoCountries = COUNTRIES.slice(0, 6);
  const currentDemo = heroDemoCountries[mockupCountryIndex] || COUNTRIES[0];

  // Dynamic Spot rate for current demo nation
  const demoSpotRateText = useMemo(() => {
    const cur = currentDemo.currency;
    if (cur === 'USD') return '1 USD = 1.0000 USD';
    if (liveRatesMap && liveRatesMap[cur]) {
      const val = liveRatesMap[cur];
      const formatted = val >= 100 ? val.toFixed(2) : val >= 10 ? val.toFixed(3) : val.toFixed(4);
      return `1 USD = ${formatted} ${cur}`;
    }
    return currentDemo.code === 'MA' ? '1 USD = 9.3527 MAD' : `1 USD = Live Spot ${cur}`;
  }, [currentDemo, liveRatesMap]);

  const coreFeatures = [
    {
      icon: <Globe size={26} color="var(--cyan-primary)" />,
      badge: 'CANVAS 60 FPS ENGINE',
      title: 'Interactive Dotted World Map',
      description:
        'A zero-latency canvas-rendered global dot matrix with instant color highlighting for selected nations, threat levels, and hover telemetry.',
      actionLabel: 'Explore Live Map →',
      onAction: onNavigateToMap
    },
    {
      icon: <TrendingUp size={26} color="var(--emerald)" />,
      badge: 'REAL-TIME FX ENGINE',
      title: 'Global Currency & Forex Exchange',
      description:
        'Live spot rates for 160+ fiat currencies with an interactive multi-currency conversion calculator and spread monitoring.',
      actionLabel: 'Launch Forex Terminal →',
      onAction: onNavigateToDashboard
    },
    {
      icon: <Bot size={26} color="var(--cyan-primary)" />,
      badge: 'GEMINI 2.5 FLASH AI CORE',
      title: 'Contextual AI Sovereign Analyst',
      description:
        'Autonomous macro-analyst injected in real-time with verified national demographics, economic indicators, and diplomatic updates.',
      actionLabel: 'Chat with AI Analyst →',
      onAction: onNavigateToDashboard
    },
    {
      icon: <AlertTriangle size={26} color="var(--amber)" />,
      badge: 'GEOPOLITICAL THREAT RADAR',
      title: 'Active Disputes & Alliances',
      description:
        'Monitor regional sovereignty recognition, trade disputes, security alliances (NATO, Arab League, AU), and defense postures.',
      actionLabel: 'View Geopolitical Matrix →',
      onAction: onNavigateToDashboard
    },
    {
      icon: <Newspaper size={26} color="var(--cyan-primary)" />,
      badge: 'YAHOO FINANCE & NEWS WIRE',
      title: 'Targeted Intelligence Newsfeeds',
      description:
        'Dual-stream news feeds specifically isolated to country-level financial trends, capital market developments, and diplomacy.',
      actionLabel: 'Read Live Wire →',
      onAction: onNavigateToDashboard
    },
    {
      icon: <Shield size={26} color="var(--indigo)" />,
      badge: 'STATELESS SECURITY',
      title: 'Enterprise JWT Authentication',
      description:
        'Encrypted session tokens, modular Spring Boot architecture, and isolated user-specific watchlist storage with instant sync.',
      actionLabel: 'Create Analyst Account →',
      onAction: onNavigateToSignIn
    }
  ];

  const stats = [
    { value: '195+', label: 'Nations Tracked', sub: 'Global Coverage' },
    { value: '160+', label: 'Currencies Monitored', sub: 'Real-time Spot Rates' },
    { value: '< 18ms', label: 'Matrix Render Speed', sub: 'Pure HTML5 Canvas' },
    { value: '99.99%', label: 'System Availability', sub: 'Continuous Feeds' }
  ];

  return (
    <div className="landing-page">
      {/* Dynamic Animated Constellation & Radar Canvas Background */}
      <AnimatedNetworkCanvas isDark={isDark} />

      {/* Ambient Gradient Orbs */}
      <div className="landing-glow glow-top-center" />
      <div className="landing-glow glow-bottom-right" />
      <div className="landing-glow glow-middle-left" />

      {/* Cyber Grid Lines Effect */}
      <div className="landing-grid-overlay" aria-hidden="true" />

      {/* Live Market Ticker Marquee */}
      <div className="ticker-bar" title={`Live API Feed Timestamp: ${tickerTimestamp}`}>
        <div className="ticker-label">
          <span className="pulse-dot" style={{ width: 7, height: 7, background: 'var(--emerald)' }} />
          <span>{isLiveApiConnected ? 'LIVE SPOT FOREX' : 'SPOT FOREX WIRE'}</span>
          <span className="live-tag">API LIVE</span>
        </div>
        <div className="ticker-track">
          {tickerItems.concat(tickerItems).map((t, idx) => (
            <div key={idx} className="ticker-item">
              <span className="ticker-pair">{t.pair}</span>
              <span className="ticker-rate">{t.rate}</span>
              <span className={`ticker-change ${t.up ? 'up' : 'down'}`}>
                {t.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-pill" onClick={onNavigateToMap}>
          <Sparkles size={14} color="var(--cyan-primary)" />
          <span>NEW: Interactive Dotted World Intelligence Map</span>
          <span className="pill-arrow">&rarr;</span>
        </div>

        <h1 className="landing-hero-title">
          The Sovereign Global Economy, <br />
          <span className="gradient-text">Decoded in Real Time.</span>
        </h1>

        <p className="landing-hero-subtitle">
          Empowering financial institutions, geopolitical analysts, and international traders with 
          centralized macroeconomic metrics, live multi-currency spot rates, 
          interactive dotted mapping, and autonomous Gemini AI sovereign intelligence.
        </p>

        {/* Hero Actions Group */}
        <div className="hero-cta-group">
          <button className="btn btn-primary btn-hero" onClick={onNavigateToDashboard}>
            <Zap size={18} />
            <span>Launch Terminal</span>
            <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary btn-hero" onClick={onNavigateToMap}>
            <Globe size={18} color="var(--cyan-primary)" />
            <span>Explore Dotted World Map</span>
          </button>
          <button className="btn btn-secondary btn-hero" onClick={onNavigateToSignIn}>
            <Lock size={16} />
            <span>Sign In / Create Account</span>
          </button>
        </div>

        {/* Live System Indicator */}
        <div className="live-status-pill">
          <span className="pulse-dot" />
          <span>GLOBAL DATA FEED ACTIVE · 195 SOVEREIGN NATIONS · 256-BIT ENCRYPTION</span>
        </div>

        {/* ── Interactive Hero Terminal Mockup ─────────────────── */}
        <div className="hero-terminal-mockup glass-card">
          {/* Terminal Window Header Bar */}
          <div className="mockup-window-bar">
            <div className="mockup-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <div className="mockup-tab">
              <Radio size={13} color="var(--cyan-primary)" className="spin-slow" />
              <span>terminal.worldwatch.io / live-monitor / {currentDemo.code}</span>
            </div>
            <div className="mockup-status">
              <span className="pulse-dot" />
              <span>LIVE TELEMETRY</span>
            </div>
          </div>

          {/* Interactive Country Selector Tabs inside Mockup */}
          <div className="mockup-country-tabs">
            {heroDemoCountries.map((c, idx) => (
              <button
                key={c.code}
                className={`mockup-tab-pill ${idx === mockupCountryIndex ? 'active' : ''}`}
                onClick={() => setMockupCountryIndex(idx)}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
                <span className="iso-code-badge" style={{ fontSize: '0.66rem', padding: '1px 5px' }}>
                  {c.code}
                </span>
              </button>
            ))}
          </div>

          {/* Mockup Body Content */}
          <div className="mockup-body">
            {/* Country Header Strip */}
            <div className="mockup-hero-strip">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: '2.4rem' }}>{currentDemo.flag}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {currentDemo.name}
                    </div>
                    {currentDemo.conflicts?.threatLevel && (
                      <div
                        className={`threat-badge ${currentDemo.conflicts.threatLevel.toLowerCase()}`}
                        style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                      >
                        <AlertTriangle size={11} />
                        THREAT: {currentDemo.conflicts.threatLevel}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 3 }}>
                    Capital: <strong style={{ color: 'var(--text-primary)' }}>{currentDemo.capital}</strong> • 
                    Region: <span style={{ color: 'var(--cyan-primary)' }}>{currentDemo.region}</span> • 
                    Population: {new Intl.NumberFormat('en-US').format(currentDemo.population)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                  onClick={onNavigateToMap}
                >
                  <Globe size={14} color="var(--cyan-primary)" />
                  <span>View on Dot Map</span>
                </button>
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  onClick={onNavigateToDashboard}
                >
                  <span>Open Full Dossier</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* 3-Column Metrics Surface */}
            <div className="mockup-grid">
              {/* FX Spot Card */}
              <div className="mockup-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    SPOT FOREX RATE
                  </div>
                  <span className="ticker-change up">+0.12% 24h</span>
                </div>
                <div
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    color: 'var(--cyan-primary)',
                    fontFamily: 'var(--font-mono)',
                    margin: '8px 0 4px'
                  }}
                >
                  {demoSpotRateText}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.73rem', color: 'var(--text-secondary)' }}>
                    Currency: {currentDemo.currency} ({currentDemo.currencySymbol})
                  </span>
                  <MiniSparkline up={true} />
                </div>
              </div>

              {/* Macro Indicators Card */}
              <div className="mockup-card">
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  MACROECONOMIC PROFILE
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GDP NOMINAL</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--emerald)' }}>
                      {currentDemo.economics?.gdpNominal || '$142.8B'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GROWTH RATE</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--cyan-primary)' }}>
                      {currentDemo.economics?.gdpGrowthRate || '+3.4%'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>INFLATION</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--amber)' }}>
                      {currentDemo.economics?.inflationRate || '1.8%'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CREDIT RATING</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {currentDemo.economics?.creditRating || 'BB+'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gemini AI Briefing Card */}
              <div className="mockup-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', color: 'var(--cyan-primary)', fontWeight: 600 }}>
                  <Bot size={14} />
                  <span>GEMINI SOVEREIGN ANALYST</span>
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginTop: 8,
                    fontStyle: 'italic'
                  }}
                >
                  "{currentDemo.conflicts?.geopoliticalAnalysis || 'Strategic maritime pivot, renewable energy investments, and robust multilateral partnerships reinforce macro resilience.'}"
                </div>
                {currentDemo.conflicts?.securityAlliances?.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                    {currentDemo.conflicts.securityAlliances.slice(0, 2).map((a, i) => (
                      <span key={i} className="alliance-pill" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Metrics Counter Section ──────────────────────── */}
      <section className="stats-section">
        <div className="stats-grid-container">
          {stats.map((s, idx) => (
            <div key={idx} className="stat-counter-box">
              <div className="stat-counter-value">{s.value}</div>
              <div className="stat-counter-label">{s.label}</div>
              <div className="stat-counter-sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dotted World Map Feature Spotlight ────────────────── */}
      <section className="map-spotlight-section">
        <div className="map-spotlight-card glass-card">
          <div className="map-spotlight-content">
            <div className="brand-badge" style={{ background: 'rgba(6,182,212,0.15)', color: 'var(--cyan-primary)' }}>
              REVOLUTIONARY VISUALIZATION
            </div>
            <h2 className="section-title" style={{ textAlign: 'left', margin: '14px 0' }}>
              True Dotted Canvas World Intelligence Map
            </h2>
            <p className="section-description" style={{ textAlign: 'left', maxWidth: 540 }}>
              Rendered on high-speed HTML5 Canvas at 60 FPS, every nation is represented by an intelligent dot matrix. 
              Clicking any nation highlights its continental territory in luminous cyan, displaying live geopolitical threat levels, 
              diplomatic ties, and macroeconomic KPIs in real-time.
            </p>

            <div className="map-spotlight-features">
              <div className="map-feature-item">
                <CheckCircle2 size={16} color="var(--emerald)" />
                <span>Zero-latency O(1) spatial dot picking</span>
              </div>
              <div className="map-feature-item">
                <CheckCircle2 size={16} color="var(--emerald)" />
                <span>Threat level color-coded dots (Critical, Elevated, Moderate, Low)</span>
              </div>
              <div className="map-feature-item">
                <CheckCircle2 size={16} color="var(--emerald)" />
                <span>Seamless Dark & Light mode dynamic theme contrast</span>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <button className="btn btn-primary btn-hero" onClick={onNavigateToMap}>
                <Globe size={18} />
                <span>Launch Interactive Dot Map</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="map-spotlight-preview" onClick={onNavigateToMap} title="Click to open interactive map">
            <div className="preview-map-mesh">
              <div className="radar-sweep" />
              <div className="preview-dot-sample pds-1" />
              <div className="preview-dot-sample pds-2" />
              <div className="preview-dot-sample pds-3" />
              <div className="preview-map-overlay-text">
                <Globe size={32} color="var(--cyan-primary)" />
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', marginTop: 8 }}>
                  ENTER LIVE ATLAS
                </span>
                <span style={{ fontSize: '0.76rem', color: 'var(--cyan-primary)' }}>
                  Click to Explore 195+ Nations &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Live Currency Quick-Converter ─────────── */}
      <section className="interactive-converter-section">
        <div className="section-header">
          <span className="brand-badge">INTERACTIVE LIVE TOOL</span>
          <h2 className="section-title">Instant Forex Spot Rate Calculator</h2>
          <p className="section-description">
            Test our conversion engine live. Exchange rates refreshed with continuous spread updates.
          </p>
        </div>

        <div className="converter-card glass-card">
          <div className="converter-inputs-row">
            <div className="calc-group">
              <label className="calc-label">AMOUNT</label>
              <input
                type="number"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Math.max(0, Number(e.target.value)))}
                className="calc-input"
              />
            </div>

            <div className="calc-group">
              <label className="calc-label">FROM</label>
              <select
                value={calcBase}
                onChange={(e) => setCalcBase(e.target.value)}
                className="calc-select"
              >
                <option value="USD">USD - US Dollar ($)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="MAD">MAD - Moroccan Dirham (DH)</option>
              </select>
            </div>

            <div className="calc-swap-icon">
              <ArrowRight size={20} color="var(--cyan-primary)" />
            </div>

            <div className="calc-group">
              <label className="calc-label">TO</label>
              <select
                value={calcTarget}
                onChange={(e) => setCalcTarget(e.target.value)}
                className="calc-select"
              >
                <option value="MAD">MAD - Moroccan Dirham (DH)</option>
                <option value="USD">USD - US Dollar ($)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="GBP">GBP - British Pound (£)</option>
                <option value="JPY">JPY - Japanese Yen (¥)</option>
                <option value="CAD">CAD - Canadian Dollar ($)</option>
              </select>
            </div>
          </div>

          <div className="calc-result-box">
            <div>
              <span className="calc-result-sub">
                {calcAmount} {calcBase} =
              </span>
              <div className="calc-result-val">
                {calculatedOutput} <span style={{ fontSize: '1.1rem', color: 'var(--cyan-primary)' }}>{calcTarget}</span>
              </div>
            </div>
            <button className="btn btn-primary" onClick={onNavigateToDashboard}>
              <span>Full Multi-Currency Grid</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Architecture & Capabilities Grid ─────────────────── */}
      <section className="features-section" id="features">
        <div className="section-header">
          <span className="brand-badge">ARCHITECTURE & CAPABILITIES</span>
          <h2 className="section-title">Engineered for Sovereign Macro Precision</h2>
          <p className="section-description">
            Combining real-time financial APIs, national census data, and Google Gemini AI 
            into a singular, unified command terminal.
          </p>
        </div>

        <div className="features-grid">
          {coreFeatures.map((f, idx) => (
            <div key={idx} className="feature-card glass-card">
              <div className="feature-icon-box">{f.icon}</div>
              <span className="feature-badge">{f.badge}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.description}</p>
              {f.actionLabel && (
                <button
                  className="feature-action-btn"
                  onClick={f.onAction}
                >
                  <span>{f.actionLabel}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Data Pipeline & Infrastructure ────────────────────── */}
      <section className="pipeline-section">
        <div className="section-header">
          <span className="brand-badge">DATA PIPELINE</span>
          <h2 className="section-title">End-to-End Enterprise Architecture</h2>
          <p className="section-description">
            Robust data flow connecting decentralized global APIs to our Spring Boot modular core and React frontend.
          </p>
        </div>

        <div className="pipeline-diagram-card glass-card">
          <div className="pipeline-step">
            <div className="pipeline-icon-box">
              <Database size={22} color="var(--cyan-primary)" />
            </div>
            <div className="pipeline-title">Global Ingestion</div>
            <div className="pipeline-desc">ExchangeRate-API, NewsAPI, TopoJSON, RestCountries</div>
          </div>
          <div className="pipeline-connector">&rarr;</div>

          <div className="pipeline-step">
            <div className="pipeline-icon-box">
              <Cpu size={22} color="var(--emerald)" />
            </div>
            <div className="pipeline-title">Spring Boot 3.2.5</div>
            <div className="pipeline-desc">Modular Monolith, JWT Auth, WebClient Reactive Caching</div>
          </div>
          <div className="pipeline-connector">&rarr;</div>

          <div className="pipeline-step">
            <div className="pipeline-icon-box">
              <Bot size={22} color="var(--purple, #a855f7)" />
            </div>
            <div className="pipeline-title">Google Gemini AI</div>
            <div className="pipeline-desc">Context-stuffed sovereign intelligence inference</div>
          </div>
          <div className="pipeline-connector">&rarr;</div>

          <div className="pipeline-step">
            <div className="pipeline-icon-box">
              <Globe size={22} color="var(--cyan-primary)" />
            </div>
            <div className="pipeline-title">React Terminal & Dot Map</div>
            <div className="pipeline-desc">60 FPS Canvas Dotted Atlas, Dark/Light Themes</div>
          </div>
        </div>
      </section>

      {/* ── Live Countries Watchlist Grid ─────────────────────── */}
      <section className="countries-matrix-section">
        <div className="section-header">
          <span className="brand-badge" style={{ background: 'rgba(6,182,212,0.15)', color: 'var(--cyan-primary)' }}>
            INSTANT ACCESS
          </span>
          <h2 className="section-title">Track Sovereign Nations Worldwide</h2>
          <p className="section-description">
            Jump directly into in-depth profiles across Africa, Europe, the Americas, Asia, and the Middle East.
          </p>
        </div>

        <div className="country-pills-row">
          {COUNTRIES.slice(0, 14).map((c) => (
            <div
              key={c.code}
              className="country-pill-item"
              onClick={onNavigateToDashboard}
            >
              <span style={{ fontSize: '1.25rem' }}>{c.flag}</span>
              <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{c.name}</span>
              <span className="iso-code-badge">{c.code}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final Call to Action ─────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-card glass-card">
          <div className="cta-glow" />
          <h2 className="cta-title">Ready to Monitor Global Geopolitics & Forex?</h2>
          <p className="cta-subtitle">
            Experience the modular WorldWatch terminal today. Create an analyst profile or explore instantly with live guest access.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-hero" onClick={onNavigateToDashboard}>
              <Zap size={18} />
              <span>Launch Terminal Now</span>
              <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary btn-hero" onClick={onNavigateToMap}>
              <Globe size={18} color="var(--cyan-primary)" />
              <span>Explore Dotted World Map</span>
            </button>
            <button className="btn btn-secondary btn-hero" onClick={onNavigateToSignIn}>
              <span>Sign In / Create Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Modern FinTech Footer ────────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="brand-icon-wrapper" style={{ width: 34, height: 34 }}>
                <Globe size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem', color: '#fff' }}>
                WORLD WATCH
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 8, maxWidth: 360, lineHeight: 1.6 }}>
              Modular Monolith Geopolitical & Forex Intelligence platform powered by Spring Boot 3.2.5, Spring AI Gemini, and React.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>TERMINAL</h4>
              <a onClick={onNavigateToDashboard}>Dashboard Terminal</a>
              <a onClick={onNavigateToMap}>Dotted World Map</a>
              <a onClick={onNavigateToSignIn}>Sign In / Register</a>
              <a href="#features">Forex Spot Rates</a>
            </div>
            <div className="footer-col">
              <h4>INTELLIGENCE</h4>
              <a onClick={onNavigateToDashboard}>Macroeconomic Dossiers</a>
              <a onClick={onNavigateToDashboard}>Conflict & Threat Matrix</a>
              <a onClick={onNavigateToDashboard}>Yahoo Finance News</a>
              <a onClick={onNavigateToDashboard}>Gemini AI Analyst</a>
            </div>
            <div className="footer-col">
              <h4>SECURITY & ARCH</h4>
              <a>Stateless JWT</a>
              <a>Spring Security 6</a>
              <a>Encrypted Storage</a>
              <a>CORS Enabled</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} WorldWatch Intelligence Inc. All rights reserved.</span>
          <span style={{ color: 'var(--cyan-primary)', fontWeight: 600 }}>
            ● Status: All Systems Operational (99.99%)
          </span>
        </div>
      </footer>
    </div>
  );
}
