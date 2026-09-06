import React from 'react';
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
  CheckCircle2,
  Lock,
  BarChart3,
  Layers,
  Activity
} from 'lucide-react';
import { COUNTRIES } from '../data/countries';

export default function LandingPage({ onNavigateToDashboard, onNavigateToSignIn }) {
  const tickerItems = [
    { pair: 'USD / MAD', rate: '9.88', change: '+0.12%', up: true },
    { pair: 'EUR / USD', rate: '1.085', change: '+0.05%', up: true },
    { pair: 'GBP / USD', rate: '1.271', change: '-0.18%', up: false },
    { pair: 'USD / JPY', rate: '154.25', change: '+0.34%', up: true },
    { pair: 'USD / AED', rate: '3.672', change: '0.00%', up: true },
    { pair: 'EUR / MAD', rate: '10.72', change: '+0.08%', up: true },
    { pair: 'USD / CAD', rate: '1.365', change: '-0.11%', up: false }
  ];

  const features = [
    {
      icon: <TrendingUp size={24} color="var(--cyan-primary)" />,
      badge: 'Real-Time FX Engine',
      title: 'Global Currency & Forex Exchange',
      description:
        'Live spot rates for 160+ fiat currencies with an interactive multi-currency conversion calculator and spread monitoring.'
    },
    {
      icon: <Bot size={24} color="var(--emerald)" />,
      badge: 'Gemini 3.5 AI Core',
      title: 'Contextual AI Country Intelligence',
      description:
        'Autonomous macro-analyst stuffed with verified national demographics, economic indicators, and diplomatic updates.'
    },
    {
      icon: <Newspaper size={24} color="var(--amber)" />,
      badge: 'Live Wire Dispatch',
      title: 'Targeted Geopolitical Newsfeed',
      description:
        'Filtered direct news feeds focusing strictly on country-specific titles, diplomatic developments, and trade policies.'
    },
    {
      icon: <Shield size={24} color="var(--indigo)" />,
      badge: 'Stateless Security',
      title: 'Enterprise JWT Authentication',
      description:
        'Encrypted session tokens, modular Spring Boot architecture, and isolated user-specific watchlist storage.'
    }
  ];

  const stats = [
    { value: '195+', label: 'Nations Monitored' },
    { value: '160+', label: 'Currencies Covered' },
    { value: '< 200ms', label: 'Spot Rate Refresh' },
    { value: '24/7', label: 'AI Intelligence Feed' }
  ];

  return (
    <div className="landing-page">
      {/* Ambient background glows */}
      <div className="landing-glow glow-top-center" />
      <div className="landing-glow glow-bottom-right" />

      {/* Live Market Ticker Marquee */}
      <div className="ticker-bar">
        <div className="ticker-label">
          <Activity size={14} color="var(--cyan-primary)" />
          <span>LIVE SPOT FOREX</span>
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
        <div className="landing-pill">
          <Sparkles size={14} color="var(--cyan-primary)" />
          <span>Next-Generation Geopolitical & Forex Intelligence</span>
          <span className="pill-arrow">&rarr;</span>
        </div>

        <h1 className="landing-hero-title">
          The Global Economy, <br />
          <span className="gradient-text">Decoded in Real Time.</span>
        </h1>

        <p className="landing-hero-subtitle">
          Empowering financial analysts, policymakers, and international traders with 
          centralized real-time country metrics, live multi-currency exchange rates, 
          geopolitical news, and an AI intelligence analyst.
        </p>

        {/* Hero Actions */}
        <div className="hero-cta-group">
          <button className="btn btn-primary btn-hero" onClick={onNavigateToDashboard}>
            <span>Access Terminal</span>
            <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary btn-hero" onClick={onNavigateToSignIn}>
            <Lock size={16} />
            <span>Sign In / Create Account</span>
          </button>
        </div>

        {/* Hero Terminal Preview Mockup */}
        <div className="hero-terminal-mockup glass-card" onClick={onNavigateToDashboard} title="Click to launch terminal">
          <div className="mockup-window-bar">
            <div className="mockup-dots">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </div>
            <div className="mockup-tab">
              <Globe size={13} color="var(--cyan-primary)" />
              <span>terminal.worldwatch.io / live-monitor / MAROC (MA)</span>
            </div>
            <div className="mockup-status">
              <span className="pulse-dot"></span>
              <span>LIVE FEED</span>
            </div>
          </div>

          <div className="mockup-body">
            <div className="mockup-hero-strip">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: '2.4rem' }}>🇲🇦</span>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
                    Kingdom of Morocco
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Capital: Rabat • Currency: MAD (DH) • Population: 37,457,971
                  </div>
                </div>
              </div>
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                Open Terminal &rarr;
              </button>
            </div>

            <div className="mockup-grid">
              <div className="mockup-card">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SPOT RATE</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>
                  1 USD = 9.88 MAD
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--emerald)' }}>+0.12% 24h Trend</div>
              </div>
              <div className="mockup-card">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GEOPOLITICAL DISPATCH</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginTop: 4 }}>
                  Morocco expands renewable energy trade corridors
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Reuters • 2h ago</div>
              </div>
              <div className="mockup-card">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GEMINI ANALYST AI</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  "Fiscal policy demonstrates resilient inflation containment with growing bilateral investment..."
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="stats-section">
        <div className="stats-grid-container">
          {stats.map((s, idx) => (
            <div key={idx} className="stat-counter-box">
              <div className="stat-counter-value">{s.value}</div>
              <div className="stat-counter-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FinTech Core Capabilities Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <span className="brand-badge">ARCHITECTURE & CAPABILITIES</span>
          <h2 className="section-title">Engineered for Global Macro Precision</h2>
          <p className="section-description">
            Combining real-time financial APIs, national census repositories, and Google Gemini AI 
            into a singular, unified command surface.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, idx) => (
            <div key={idx} className="feature-card glass-card">
              <div className="feature-icon-box">{f.icon}</div>
              <span className="feature-badge">{f.badge}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Countries Matrix Preview */}
      <section className="countries-matrix-section">
        <div className="section-header">
          <span className="brand-badge" style={{ background: 'rgba(6,182,212,0.15)', color: 'var(--cyan-primary)' }}>
            INSTANT ACCESS
          </span>
          <h2 className="section-title">Track Any Sovereign Nation</h2>
          <p className="section-description">
            Jump directly into in-depth profiles across Europe, Americas, Asia, Africa, and the Middle East.
          </p>
        </div>

        <div className="country-pills-row">
          {COUNTRIES.slice(0, 10).map((c) => (
            <div
              key={c.code}
              className="country-pill-item"
              onClick={onNavigateToDashboard}
            >
              <span style={{ fontSize: '1.2rem' }}>{c.flag}</span>
              <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{c.name}</span>
              <span className="iso-code-badge">{c.code}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="cta-section">
        <div className="cta-card glass-card">
          <div className="cta-glow" />
          <h2 className="cta-title">Ready to Monitor the World?</h2>
          <p className="cta-subtitle">
            Experience the modular WorldWatch terminal today. Create an analyst profile or dive right in with instant guest access.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-hero" onClick={onNavigateToDashboard}>
              <span>Launch Terminal Now</span>
              <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary btn-hero" onClick={onNavigateToSignIn}>
              <span>Sign In / Create Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* Modern FinTech Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="brand-icon-wrapper" style={{ width: 32, height: 32 }}>
                <Globe size={18} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
                WORLD WATCH
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 8, maxWidth: 360 }}>
              Modular Monolith Geopolitical & Forex Intelligence platform powered by Spring Boot 3.2.5, Spring AI, and React.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>PLATFORM</h4>
              <a onClick={onNavigateToDashboard}>Dashboard Terminal</a>
              <a onClick={onNavigateToSignIn}>Sign In / Register</a>
              <a href="#features">FX Spot Rates</a>
              <a href="#features">AI Intelligence</a>
            </div>
            <div className="footer-col">
              <h4>BACKEND APIS</h4>
              <a>ExchangeRate-API</a>
              <a>NewsAPI Direct</a>
              <a>Google Gemini 3.5</a>
              <a>countries.dev</a>
            </div>
            <div className="footer-col">
              <h4>SECURITY</h4>
              <a>Stateless JWT</a>
              <a>Spring Security 6</a>
              <a>Encrypted Storage</a>
              <a>CORS Allowed</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} WorldWatch Intelligence Inc. All rights reserved.</span>
          <span style={{ color: 'var(--cyan-primary)' }}>Status: All Systems Operational (99.99%)</span>
        </div>
      </footer>
    </div>
  );
}
