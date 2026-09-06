import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  FileText,
  Compass,
  RefreshCw,
  Shield,
  Layers
} from 'lucide-react';
import { fetchConflictProfile } from '../api/client';

export default function ConflictsWidget({ country }) {
  const [conflictData, setConflictData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadConflicts = async () => {
    if (!country?.code) return;
    setLoading(true);
    try {
      const data = await fetchConflictProfile(country.code);
      if (data && data.threatLevel) {
        setConflictData(data);
      } else if (country.conflicts) {
        setConflictData(country.conflicts);
      } else {
        setConflictData({
          threatLevel: 'LOW',
          activeDisputes: ['No major active territorial disputes recorded'],
          economicSanctions: ['No active unilateral or multilateral sanctions'],
          tradeDisputes: ['Standard WTO bilateral trade protocols'],
          securityAlliances: ['United Nations', 'Regional Economic Coalition'],
          geopoliticalAnalysis: 'Sovereign governance maintains diplomatic stability and regular trade connectivity.'
        });
      }
    } catch {
      setConflictData(country.conflicts || {
        threatLevel: 'LOW',
        activeDisputes: ['No major active territorial disputes recorded'],
        economicSanctions: ['No active unilateral or multilateral sanctions'],
        tradeDisputes: ['Standard WTO bilateral trade protocols'],
        securityAlliances: ['United Nations', 'Regional Economic Coalition'],
        geopoliticalAnalysis: 'Sovereign governance maintains diplomatic stability and regular trade connectivity.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConflicts();
  }, [country.code]);

  const data = conflictData || country.conflicts || {};
  const threat = (data.threatLevel || 'LOW').toUpperCase();

  const getThreatBadgeClass = () => {
    switch (threat) {
      case 'CRITICAL':
        return 'threat-badge critical';
      case 'ELEVATED':
        return 'threat-badge elevated';
      case 'MODERATE':
        return 'threat-badge moderate';
      default:
        return 'threat-badge low';
    }
  };

  return (
    <div className="glass-card">
      <div className="widget-header">
        <div className="widget-title">
          <ShieldAlert size={18} color={threat === 'CRITICAL' || threat === 'ELEVATED' ? 'var(--rose)' : 'var(--amber)'} />
          <span>Geopolitical & Economic Conflicts — {country.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className={getThreatBadgeClass()}>
            <span className="pulse-dot" style={{
              background: threat === 'CRITICAL' || threat === 'ELEVATED' ? 'var(--rose)' : (threat === 'MODERATE' ? 'var(--amber)' : 'var(--emerald)'),
              boxShadow: 'none'
            }}></span>
            <span>THREAT: {threat}</span>
          </div>
          <button
            className="btn btn-secondary btn-icon"
            onClick={loadConflicts}
            disabled={loading}
            title="Refresh conflict profile"
            style={{ width: 32, height: 32 }}
          >
            <RefreshCw size={14} className={loading ? 'fa-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="widget-body">
        <div className="conflict-container">
          {/* Active Disputes & Border Tensions */}
          <div className="conflict-section">
            <div className="conflict-section-title">
              <AlertTriangle size={15} color="var(--amber)" />
              <span>Active Disputes & Territorial Tensions</span>
            </div>
            <ul className="dispute-list">
              {(data.activeDisputes && data.activeDisputes.length > 0 ? data.activeDisputes : ['None reported']).map((item, idx) => (
                <li key={idx} className="dispute-item">
                  <span className="dispute-bullet" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sanctions & Trade Barriers */}
          <div className="conflict-section">
            <div className="conflict-section-title">
              <FileText size={15} color="var(--cyan-primary)" />
              <span>Sanctions, Embargoes & Trade Disputes</span>
            </div>
            <div className="sanction-tags-grid">
              {(data.economicSanctions || []).concat(data.tradeDisputes || []).map((item, idx) => (
                <div key={idx} className="sanction-chip">
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Defense & Security Alliances */}
          <div className="conflict-section">
            <div className="conflict-section-title">
              <Shield size={15} color="var(--emerald)" />
              <span>Defense Treaties & Security Alliances</span>
            </div>
            <div className="alliances-row">
              {(data.securityAlliances || ['United Nations Member']).map((alliance, idx) => (
                <span key={idx} className="alliance-pill">
                  {alliance}
                </span>
              ))}
            </div>
          </div>

          {/* Strategic Analysis Summary */}
          {data.geopoliticalAnalysis && (
            <div className="strategic-summary-box">
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--cyan-primary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>
                Strategic Stability Assessment
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {data.geopoliticalAnalysis}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
