import React, {
  useEffect, useRef, useState, useCallback, useMemo
} from 'react';
import { feature } from 'topojson-client';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import worldAtlas from 'world-atlas/countries-110m.json';
import { COUNTRIES } from '../data/countries';
import { NUMERIC_TO_ALPHA2 } from '../data/countryCodeMap';
import { useTheme } from '../context/ThemeContext';
import {
  Globe, Search, ZoomIn, ZoomOut, RotateCcw,
  MapPin, AlertTriangle, Shield, BarChart2, ChevronRight, X
} from 'lucide-react';

/* ── Pre-extract GeoJSON features synchronously (instant, 0ms network) ── */
const WORLD_FEATURES = (() => {
  try {
    const feats = feature(worldAtlas, worldAtlas.objects.countries).features;
    feats.forEach(f => {
      f._alpha2 = NUMERIC_TO_ALPHA2[Number(f.id)] || null;
    });
    return feats;
  } catch (err) {
    console.error('Failed to parse world atlas', err);
    return [];
  }
})();

/* ── Dot settings ─────────────────────────────────────────────── */
const DOT_SPACING = 5.5; // px between dot centers
const DOT_RADIUS  = 1.5;

/* ── Build dot map via fast offscreen canvas rasterization ────── */
function buildDotMapFast(features, rawW, rawH) {
  const width  = Math.max(300, Math.floor(rawW));
  const height = Math.max(200, Math.floor(rawH));

  // Projection tailored to Natural Earth
  const proj = geoNaturalEarth1()
    .scale(Math.min(width / 5.8, height / 2.9))
    .translate([width / 2, height / 2]);

  // Offscreen canvas for color-indexed pixel sampling
  const oc  = document.createElement('canvas');
  oc.width  = width;
  oc.height = height;
  const ctx = oc.getContext('2d', { willReadFrequently: true });
  ctx.clearRect(0, 0, width, height);

  const colorToAlpha2 = new Array(features.length + 1);
  const path = geoPath().projection(proj).context(ctx);

  features.forEach((f, i) => {
    const id = i + 1; // 1-based index (0 is transparent ocean)
    const r = (id >> 16) & 0xff;
    const g = (id >>  8) & 0xff;
    const b =  id        & 0xff;
    colorToAlpha2[id] = f._alpha2 || null;

    ctx.beginPath();
    path(f);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fill();
  });

  // Read ImageData once
  const { data } = ctx.getImageData(0, 0, width, height);

  const dots = [];
  const grid = new Map(); // O(1) hover & click lookups

  for (let py = DOT_SPACING; py < height - DOT_SPACING; py += DOT_SPACING) {
    for (let px = DOT_SPACING; px < width - DOT_SPACING; px += DOT_SPACING) {
      const ix = Math.floor(px);
      const iy = Math.floor(py);
      const idx = (iy * width + ix) * 4;
      const a   = data[idx + 3];
      if (a < 120) continue; // transparent ocean

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const id = (r << 16) | (g << 8) | b;
      if (id === 0 || id > features.length) continue;

      const alpha2 = colorToAlpha2[id] || null;
      const dot = { x: px, y: py, alpha2 };
      dots.push(dot);

      const gx = Math.round(px / DOT_SPACING);
      const gy = Math.round(py / DOT_SPACING);
      grid.set(`${gx}_${gy}`, dot);
    }
  }

  return { dots, grid, proj, width, height };
}

export default function WorldMap({ selectedCountry, onSelectCountry, onNavigateToDashboard }) {
  const { isDark } = useTheme();

  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const dotMapRef    = useRef(null);

  const [mapReady, setMapReady] = useState(false);
  const [hoveredAlpha2, setHoveredAlpha2] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart  = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const transformRef = useRef({ k: 1, x: 0, y: 0 });

  useEffect(() => {
    transformRef.current = transform;
  }, [transform]);

  /* Fast Country Lookups */
  const trackedSet   = useMemo(() => new Set(COUNTRIES.map(c => c.code)), []);
  const countriesMap = useMemo(() => Object.fromEntries(COUNTRIES.map(c => [c.code, c])), []);
  const selectedCode = selectedCountry?.code ?? null;

  /* Theme-aware Color Tokens */
  const colors = useMemo(() => {
    if (isDark) {
      return {
        selected: '#00f2fe',
        selectedGlow: 'rgba(0, 242, 254, 0.45)',
        hover: '#38bdf8',
        tracked: 'rgba(56, 189, 248, 0.55)',
        other: 'rgba(148, 163, 184, 0.32)',
        threat: {
          CRITICAL: '#f43f5e',
          ELEVATED: '#fb923c',
          MODERATE: '#f59e0b',
          LOW:      '#10b981'
        }
      };
    } else {
      return {
        selected: '#0284c7',
        selectedGlow: 'rgba(2, 132, 199, 0.35)',
        hover: '#0891b2',
        tracked: 'rgba(14, 165, 233, 0.65)',
        other: 'rgba(148, 163, 184, 0.50)',
        threat: {
          CRITICAL: '#e11d48',
          ELEVATED: '#ea580c',
          MODERATE: '#d97706',
          LOW:      '#059669'
        }
      };
    }
  }, [isDark]);

  /* Build dot matrix whenever container dimensions are measured */
  const rebuildMatrix = useCallback((w, h) => {
    if (!w || !h || w < 50 || h < 50) return;
    const dm = buildDotMapFast(WORLD_FEATURES, w, h);
    dotMapRef.current = dm;
    setMapReady(true);
  }, []);

  /* ResizeObserver on map wrapper */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        if (width > 50 && height > 50) {
          rebuildMatrix(width, height);
        }
      }
    });

    ro.observe(container);

    // Initial measurement
    const rect = container.getBoundingClientRect();
    if (rect.width > 50 && rect.height > 50) {
      rebuildMatrix(rect.width, rect.height);
    }

    return () => ro.disconnect();
  }, [rebuildMatrix]);

  /* ── Canvas Rendering Loop ─────────────────────────────────── */
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const dm     = dotMapRef.current;
    if (!canvas || !dm) return;

    const dpr = window.devicePixelRatio || 1;
    const cssW = dm.width;
    const cssH = dm.height;

    if (canvas.width !== Math.floor(cssW * dpr) || canvas.height !== Math.floor(cssH * dpr)) {
      canvas.width  = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width  = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
    }

    const ctx = canvas.getContext('2d');
    const t   = transformRef.current;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
    ctx.translate(t.x, t.y);
    ctx.scale(t.k, t.k);

    const dots = dm.dots;
    const len  = dots.length;

    // First pass: render all non-selected dots
    for (let i = 0; i < len; i++) {
      const dot = dots[i];
      const a2 = dot.alpha2;
      if (a2 === selectedCode) continue; // draw selected in top pass

      let color = colors.other;
      let radius = DOT_RADIUS;

      if (a2 === hoveredAlpha2) {
        color = colors.hover;
        radius = 2.0;
      } else if (a2 && trackedSet.has(a2)) {
        const tl = countriesMap[a2]?.conflicts?.threatLevel;
        color = colors.threat[tl] || colors.tracked;
      }

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Second pass: render selected country dots with vibrant glow and larger radius
    if (selectedCode) {
      ctx.shadowColor = colors.selectedGlow;
      ctx.shadowBlur  = 6;

      for (let i = 0; i < len; i++) {
        const dot = dots[i];
        if (dot.alpha2 !== selectedCode) continue;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2.3, 0, Math.PI * 2);
        ctx.fillStyle = colors.selected;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }, [selectedCode, hoveredAlpha2, trackedSet, countriesMap, colors]);

  // Re-render whenever visual state changes
  useEffect(() => {
    if (mapReady) {
      renderCanvas();
    }
  }, [renderCanvas, mapReady, transform, selectedCode, hoveredAlpha2, colors]);

  /* ── O(1) Screen Coordinates to Dot Lookup ─────────────────── */
  const screenToDot = useCallback((cx, cy) => {
    const dm = dotMapRef.current;
    const t  = transformRef.current;
    if (!dm) return null;

    const mx = (cx - t.x) / t.k;
    const my = (cy - t.y) / t.k;

    const gx = Math.round(mx / DOT_SPACING);
    const gy = Math.round(my / DOT_SPACING);

    // Direct O(1) key check
    let dot = dm.grid.get(`${gx}_${gy}`);
    if (!dot) {
      // Check adjacent 8-neighbor cells for forgiving touch/click tolerance
      for (let dx = -1; dx <= 1 && !dot; dx++) {
        for (let dy = -1; dy <= 1 && !dot; dy++) {
          dot = dm.grid.get(`${gx + dx}_${gy + dy}`);
        }
      }
    }
    return dot ?? null;
  }, []);

  /* Mouse & Pan Handlers */
  const handleMouseMove = useCallback((e) => {
    if (isPanning.current) {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setTransform(t => ({
        ...t,
        x: panStart.current.tx + dx,
        y: panStart.current.ty + dy,
      }));
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const dot = screenToDot(cx, cy);
    const a2  = dot?.alpha2 ?? null;

    setHoveredAlpha2(a2);
    if (dot && a2) {
      setTooltip({ x: cx, y: cy, alpha2: a2 });
    } else {
      setTooltip(null);
    }
  }, [screenToDot]);

  const handleMouseLeave = useCallback(() => {
    if (!isPanning.current) {
      setHoveredAlpha2(null);
      setTooltip(null);
    }
    isPanning.current = false;
  }, []);

  const handleMouseDown = useCallback((e) => {
    isPanning.current = true;
    panStart.current  = {
      x: e.clientX,
      y: e.clientY,
      tx: transformRef.current.x,
      ty: transformRef.current.y
    };
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const handleClick = useCallback((e) => {
    // If user dragged more than 5px, it's a pan, not a click
    if (Math.abs(e.clientX - panStart.current.x) > 5 || Math.abs(e.clientY - panStart.current.y) > 5) {
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const dot = screenToDot(e.clientX - rect.left, e.clientY - rect.top);
    if (dot?.alpha2) {
      const found = countriesMap[dot.alpha2];
      if (found) {
        onSelectCountry?.(found);
      }
    }
  }, [screenToDot, countriesMap, onSelectCountry]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const scale = e.deltaY < 0 ? 1.18 : 1 / 1.18;
    const rect  = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    setTransform(t => {
      const newK = Math.max(0.75, Math.min(14, t.k * scale));
      const ratio = newK / t.k;
      return {
        k: newK,
        x: cx - ratio * (cx - t.x),
        y: cy - ratio * (cy - t.y)
      };
    });
  }, []);

  /* Search Functionality */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchTerm.toLowerCase();
    setSearchResults(
      COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        (c.capital && c.capital.toLowerCase().includes(q))
      ).slice(0, 6)
    );
  }, [searchTerm]);

  const handleSelectSearchResult = (c) => {
    onSelectCountry?.(c);
    setSearchTerm('');
    setSearchResults([]);

    // Find country feature to center view
    const feat = WORLD_FEATURES.find(f => f._alpha2 === c.code);
    if (feat && dotMapRef.current) {
      try {
        const centroid = geoPath().projection(dotMapRef.current.proj).centroid(feat);
        if (centroid && !isNaN(centroid[0]) && !isNaN(centroid[1])) {
          const w = dotMapRef.current.width;
          const h = dotMapRef.current.height;
          const targetK = 2.2;
          setTransform({
            k: targetK,
            x: (w / 2) - centroid[0] * targetK,
            y: (h / 2) - centroid[1] * targetK,
          });
        }
      } catch (err) {
        // Centroid fallback
      }
    }
  };

  /* Zoom controls */
  const zoomIn  = () => setTransform(t => ({ ...t, k: Math.min(t.k * 1.4, 14) }));
  const zoomOut = () => setTransform(t => ({ ...t, k: Math.max(t.k / 1.4, 0.75) }));
  const reset   = () => setTransform({ k: 1, x: 0, y: 0 });

  /* Active Country Details for Right Sidebar */
  const tooltipCountry = tooltip?.alpha2 ? countriesMap[tooltip.alpha2] : null;
  const selectedData   = selectedCode    ? countriesMap[selectedCode]   : null;

  return (
    <div className="map-view-container">
      {/* Header Bar */}
      <div className="map-header">
        <div className="map-header-left">
          <div className="map-header-title">
            <Globe size={18} color="var(--cyan-primary)" />
            <span>WORLD INTELLIGENCE MAP</span>
            <span className="map-header-badge">LIVE</span>
          </div>
          <span className="map-header-sub">
            {COUNTRIES.length} tracked nations · Dots represent countries — click any nation to inspect
          </span>
        </div>

        <div className="map-search-wrapper">
          <div className="map-search-box">
            <Search size={15} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Find a nation…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="map-search-input"
            />
            {searchTerm && (
              <button
                className="map-search-clear"
                onClick={() => { setSearchTerm(''); setSearchResults([]); }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="map-search-dropdown">
              {searchResults.map(c => (
                <div
                  key={c.code}
                  className="map-search-item"
                  onClick={() => handleSelectSearchResult(c)}
                >
                  <span className="map-search-flag">{c.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div className="map-search-name">{c.name}</div>
                    <div className="map-search-meta">{c.capital} · {c.region}</div>
                  </div>
                  <span className="iso-code-badge" style={{ fontSize: '0.7rem' }}>{c.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Map + Sidebar Surface */}
      <div className="map-main-area">
        {/* Canvas Wrapper */}
        <div ref={containerRef} className="map-canvas-wrapper">
          {!mapReady && (
            <div className="map-loading">
              <div className="map-loading-dots">
                {[0, 1, 2, 3, 4].map(i => (
                  <span
                    key={i}
                    className="map-loading-dot"
                    style={{ animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </div>
              <span>Building dot matrix…</span>
            </div>
          )}

          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              opacity: mapReady ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
            onWheel={handleWheel}
          />

          {/* Hover Tooltip */}
          {tooltip && (
            <div
              className="map-tooltip"
              style={{
                left: Math.min(tooltip.x + 16, (containerRef.current?.clientWidth || 800) - 240),
                top: Math.max(tooltip.y - 80, 8),
                pointerEvents: 'none',
              }}
            >
              <div className="map-tooltip-header">
                <span className="map-tooltip-flag">
                  {tooltipCountry?.flag || '🌐'}
                </span>
                <div>
                  <div className="map-tooltip-name">
                    {tooltipCountry?.name || tooltip.alpha2 || 'Unknown'}
                  </div>
                  <div className="map-tooltip-alpha2">{tooltip.alpha2}</div>
                </div>
              </div>
              {tooltipCountry ? (
                <div className="map-tooltip-body">
                  {tooltipCountry.capital && (
                    <div className="map-tooltip-row">
                      <MapPin size={11} />
                      {tooltipCountry.capital}
                    </div>
                  )}
                  {tooltipCountry.region && (
                    <div className="map-tooltip-row">
                      <Globe size={11} />
                      {tooltipCountry.region}
                    </div>
                  )}
                  {tooltipCountry.conflicts?.threatLevel && (
                    <div className="map-tooltip-row">
                      <AlertTriangle size={11} />
                      <span style={{ color: colors.threat[tooltipCountry.conflicts.threatLevel] || 'inherit' }}>
                        {tooltipCountry.conflicts.threatLevel}
                      </span>
                    </div>
                  )}
                  <div className="map-tooltip-cta">Click to select →</div>
                </div>
              ) : (
                <div className="map-tooltip-body">
                  <div className="map-tooltip-row" style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                    Sovereign nation
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Zoom Controls */}
          <div className="map-zoom-controls">
            <button className="map-zoom-btn" onClick={zoomIn} title="Zoom in">
              <ZoomIn size={16} />
            </button>
            <button className="map-zoom-btn" onClick={zoomOut} title="Zoom out">
              <ZoomOut size={16} />
            </button>
            <button className="map-zoom-btn" onClick={reset} title="Reset View">
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Legend */}
          <div className="map-legend">
            <div className="map-legend-title">DOT MATRIX</div>
            {[
              ['SELECTED',  colors.selected],
              ['CRITICAL',  colors.threat.CRITICAL],
              ['ELEVATED',  colors.threat.ELEVATED],
              ['MODERATE',  colors.threat.MODERATE],
              ['TRACKED',   colors.tracked],
              ['OTHER',     colors.other],
            ].map(([label, color]) => (
              <div key={label} className="map-legend-item">
                <span className="map-legend-dot" style={{ background: color }} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Intelligence Sidebar */}
        <div className="map-sidebar">
          {selectedData ? (
            <>
              <div className="map-sidebar-country-header">
                <div className="map-sidebar-flag-box">
                  <img
                    src={selectedData.flagSvg || `https://flagcdn.com/${selectedData.code.toLowerCase()}.svg`}
                    alt={`Flag of ${selectedData.name}`}
                    className="map-sidebar-flag-img"
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                  <span className="map-sidebar-emoji-flag">{selectedData.flag}</span>
                </div>
                <div>
                  <div className="map-sidebar-country-name">{selectedData.name}</div>
                  <div className="map-sidebar-country-region">{selectedData.region}</div>
                  {selectedData.officialName && (
                    <div className="map-sidebar-country-official">{selectedData.officialName}</div>
                  )}
                </div>
              </div>

              {selectedData.conflicts?.threatLevel && (
                <div
                  className={`threat-badge ${selectedData.conflicts.threatLevel.toLowerCase()}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <AlertTriangle size={12} />
                  THREAT: {selectedData.conflicts.threatLevel}
                </div>
              )}

              <div className="map-sidebar-kpis">
                {[
                  { label: 'Capital',       value: selectedData.capital },
                  { label: 'Population',    value: selectedData.population ? new Intl.NumberFormat('en-US').format(selectedData.population) : null },
                  { label: 'Currency',      value: selectedData.currency ? `${selectedData.currency} (${selectedData.currencySymbol})` : null },
                  { label: 'GDP Nominal',   value: selectedData.economics?.gdpNominal,    color: 'var(--emerald)' },
                  { label: 'GDP Growth',    value: selectedData.economics?.gdpGrowthRate, color: 'var(--cyan-primary)' },
                  { label: 'Credit Rating', value: selectedData.economics?.creditRating,  color: 'var(--amber)' },
                  { label: 'Governance',    value: selectedData.details?.governmentType },
                ].filter(k => k.value).map(({ label, value, color }) => (
                  <div key={label} className="map-sidebar-kpi">
                    <span className="map-sidebar-kpi-label">{label}</span>
                    <span className="map-sidebar-kpi-value" style={color ? { color } : {}}>{value}</span>
                  </div>
                ))}
              </div>

              {selectedData.conflicts?.securityAlliances?.length > 0 && (
                <div className="map-sidebar-alliances">
                  <div className="map-sidebar-section-label">
                    <Shield size={12} color="var(--emerald)" /> Alliances
                  </div>
                  <div className="meta-pills-row">
                    {selectedData.conflicts.securityAlliances.slice(0, 3).map((a, i) => (
                      <span
                        key={i}
                        className="alliance-pill"
                        style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="btn btn-primary map-sidebar-cta"
                onClick={() => onNavigateToDashboard?.()}
              >
                <BarChart2 size={15} />
                <span>Open Intelligence Profile</span>
                <ChevronRight size={15} />
              </button>
            </>
          ) : (
            <div className="map-sidebar-empty">
              <Globe size={40} color="var(--text-muted)" style={{ opacity: 0.3 }} />
              <p>Click any dot on the map to load an intelligence profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
