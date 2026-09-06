import React, { useState } from 'react';
import {
  MapPin,
  Users,
  Coins,
  Compass,
  Star,
  Activity,
  Landmark,
  UserCheck,
  Languages,
  Maximize2,
  Briefcase,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
  Clock,
  Navigation
} from 'lucide-react';

export default function CountryHero({
  country,
  countryData,
  countryDetails,
  isFavorite,
  onToggleFavorite,
  isLoading
}) {
  const [showDossier, setShowDossier] = useState(true);
  const [flagImgFailed, setFlagImgFailed] = useState(false);

  // Merge backend / REST Countries data with selected country defaults
  const displayName = countryDetails?.name || countryData?.name || country.name;
  const officialName = countryDetails?.officialName || country.officialName;
  const displayCapital = countryDetails?.capital || countryData?.capital || country.capital || 'N/A';
  const displayPopulation = countryDetails?.population || countryData?.population || country.population || 0;
  const displayCurrency = countryDetails?.currency || countryData?.currency || country.currency || 'USD';
  const displayRegion = countryDetails?.region || country.region || 'Global';
  const displaySubregion = countryDetails?.subregion || country.region || 'Sovereign State';

  const details = countryDetails || country.details || {};
  const flagSvgUrl = countryDetails?.flagSvg || country.flagSvg || `https://flagcdn.com/${country.code.toLowerCase()}.svg`;
  const flagAlt = countryDetails?.flagAlt || `Flag of ${displayName}`;
  const coatOfArmsUrl = countryDetails?.coatOfArmsSvg;
  const mapsUrl = countryDetails?.mapsUrl || `https://www.google.com/maps/place/${encodeURIComponent(displayName)}`;
  const timezones = countryDetails?.timezones || ['UTC+00:00'];
  const borders = countryDetails?.borderCountries || details.borderCountries || [];
  const unMember = countryDetails?.unMember ?? true;

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="glass-card country-hero-card">
      <div className="country-hero-header">
        <div className="country-main-title">
          {/* Flag & Coat of Arms Showcase */}
          <div className="country-visual-emblems">
            <div className="country-flag-container" title={flagAlt}>
              {!flagImgFailed ? (
                <img
                  src={flagSvgUrl}
                  alt={flagAlt}
                  className="country-flag-vector-img"
                  onError={() => setFlagImgFailed(true)}
                />
              ) : (
                <span className="country-large-flag" role="img" aria-label={displayName}>
                  {country.flag}
                </span>
              )}
            </div>

            {coatOfArmsUrl && (
              <div className="country-coat-of-arms-box" title={`Official Coat of Arms of ${displayName}`}>
                <img
                  src={coatOfArmsUrl}
                  alt={`Coat of arms of ${displayName}`}
                  className="country-coat-of-arms-img"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          <div className="country-title-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1>{displayName}</h1>
              <span className="iso-code-badge">{country.code}</span>
              {unMember && (
                <span className="un-member-badge" title="United Nations Recognized Member State">
                  <Shield size={12} /> UN Member
                </span>
              )}
            </div>
            
            {officialName && officialName !== displayName && (
              <div className="country-official-name">
                {officialName}
              </div>
            )}

            <div className="country-badges-row">
              <span className="region-badge">Region: <strong>{displayRegion}</strong></span>
              {displaySubregion && displaySubregion !== displayRegion && (
                <>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span className="region-badge" style={{ background: 'transparent', padding: 0 }}>
                    {displaySubregion}
                  </span>
                </>
              )}
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--emerald)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Activity size={13} /> Active Monitor
              </span>
            </div>
          </div>
        </div>

        {/* Actions: Map Link, Toggle Dossier & Favorite */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              title="Explore country coordinates on Google Maps satellite"
              style={{ padding: '10px 14px', fontSize: '0.84rem' }}
            >
              <Navigation size={14} color="var(--cyan-primary)" />
              <span>Explore Map</span>
              <ExternalLink size={12} style={{ opacity: 0.7 }} />
            </a>
          )}

          <button
            className="btn btn-secondary"
            onClick={() => setShowDossier(!showDossier)}
            title="Toggle sovereign governance dossier"
            style={{ padding: '10px 16px', fontSize: '0.84rem' }}
          >
            <Landmark size={15} color="var(--cyan-primary)" />
            <span>{showDossier ? 'Hide Governance' : 'View Governance'}</span>
            {showDossier ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button
            className={`btn ${isFavorite ? 'btn-outline-cyan' : 'btn-secondary'}`}
            onClick={onToggleFavorite}
            style={{ padding: '10px 20px', borderColor: isFavorite ? 'var(--amber)' : undefined }}
          >
            <Star
              size={18}
              fill={isFavorite ? 'var(--amber)' : 'none'}
              color={isFavorite ? 'var(--amber)' : 'currentColor'}
            />
            <span>{isFavorite ? 'Saved to Watchlist' : 'Add to Watchlist'}</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Stat Tiles */}
      <div className="stat-grid">
        <div className="stat-tile">
          <div className="stat-icon cyan">
            <MapPin size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Capital City</span>
            <span className="stat-value">{isLoading ? '...' : displayCapital}</span>
          </div>
        </div>

        <div className="stat-tile">
          <div className="stat-icon emerald">
            <Users size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Population</span>
            <span className="stat-value">{isLoading ? '...' : formatNumber(displayPopulation)}</span>
          </div>
        </div>

        <div className="stat-tile">
          <div className="stat-icon amber">
            <Coins size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">National Currency</span>
            <span className="stat-value">{isLoading ? '...' : `${displayCurrency} (${country.currencySymbol || ''})`}</span>
          </div>
        </div>

        <div className="stat-tile">
          <div className="stat-icon indigo">
            <Compass size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Subregion & Area</span>
            <span className="stat-value">{displayRegion}</span>
          </div>
        </div>
      </div>

      {/* Expandable Sovereign Governance & REST Countries Profile */}
      {showDossier && (
        <div className="country-dossier-panel">
          <div className="dossier-grid">
            {/* Government Type */}
            <div className="dossier-item">
              <div className="dossier-label">
                <Landmark size={14} color="var(--cyan-primary)" />
                <span>Governance & Regime</span>
              </div>
              <div className="dossier-value">{details.governmentType || 'Sovereign Republic'}</div>
            </div>

            {/* Head of State */}
            <div className="dossier-item">
              <div className="dossier-label">
                <UserCheck size={14} color="var(--emerald)" />
                <span>Head of State / Leader</span>
              </div>
              <div className="dossier-value">{details.headOfState || 'Constitutional Leader'}</div>
            </div>

            {/* Official Languages */}
            <div className="dossier-item">
              <div className="dossier-label">
                <Languages size={14} color="var(--amber)" />
                <span>Official Languages</span>
              </div>
              <div className="dossier-value">
                {Array.isArray(details.officialLanguages) && details.officialLanguages.length > 0
                  ? details.officialLanguages.join(', ')
                  : (countryDetails?.officialLanguages && countryDetails.officialLanguages.length > 0
                    ? countryDetails.officialLanguages.join(', ')
                    : 'National Official Language')}
              </div>
            </div>

            {/* Total Land Area */}
            <div className="dossier-item">
              <div className="dossier-label">
                <Maximize2 size={14} color="var(--indigo)" />
                <span>Territorial Surface</span>
              </div>
              <div className="dossier-value">
                {details.landAreaKm2 || countryDetails?.landAreaKm2
                  ? `${formatNumber(details.landAreaKm2 || countryDetails?.landAreaKm2)} km²`
                  : 'N/A'}
              </div>
            </div>
          </div>

          {/* Timezones & Land Borders Section */}
          <div className="dossier-meta-row">
            {timezones && timezones.length > 0 && (
              <div className="meta-subgroup">
                <div className="meta-subgroup-label">
                  <Clock size={13} color="var(--cyan-primary)" />
                  <span>Timezones:</span>
                </div>
                <div className="meta-pills-row">
                  {timezones.slice(0, 5).map((tz, i) => (
                    <span key={i} className="meta-pill timezone-pill">
                      {tz}
                    </span>
                  ))}
                  {timezones.length > 5 && (
                    <span className="meta-pill timezone-pill" title={timezones.join(', ')}>
                      +{timezones.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {borders && borders.length > 0 && (
              <div className="meta-subgroup">
                <div className="meta-subgroup-label">
                  <Compass size={13} color="var(--amber)" />
                  <span>Land Borders ({borders.length}):</span>
                </div>
                <div className="meta-pills-row">
                  {borders.map((b, i) => (
                    <span key={i} className="meta-pill border-pill">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Major Export & Strategic Industries */}
          {details.majorIndustries && details.majorIndustries.length > 0 && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                <Briefcase size={13} color="var(--cyan-primary)" />
                <span>Major Strategic & Export Industries:</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {details.majorIndustries.map((ind, i) => (
                  <span key={i} className="industry-pill">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

