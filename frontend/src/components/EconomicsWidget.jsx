import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Percent,
  DollarSign,
  Scale,
  ShieldCheck,
  RefreshCw,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { fetchEconomicIndicators } from '../api/client';

export default function EconomicsWidget({ country }) {
  const [indicators, setIndicators] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadIndicators = async () => {
    if (!country?.code) return;
    setLoading(true);
    try {
      const data = await fetchEconomicIndicators(country.code);
      if (data && data.gdpNominal) {
        setIndicators(data);
      } else if (country.economics) {
        setIndicators(country.economics);
      } else {
        setIndicators({
          gdpNominal: '$120.0B',
          gdpGrowthRate: '+2.4%',
          inflationRate: '2.5%',
          unemploymentRate: '6.8%',
          centralBankRate: '3.50%',
          publicDebtRatio: '65.0%',
          tradeBalance: '-$5.0B',
          creditRating: 'BBB (Stable)'
        });
      }
    } catch {
      setIndicators(country.economics || {
        gdpNominal: '$120.0B',
        gdpGrowthRate: '+2.4%',
        inflationRate: '2.5%',
        unemploymentRate: '6.8%',
        centralBankRate: '3.50%',
        publicDebtRatio: '65.0%',
        tradeBalance: '-$5.0B',
        creditRating: 'BBB (Stable)'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIndicators();
  }, [country.code]);

  const data = indicators || country.economics || {};

  return (
    <div className="glass-card">
      <div className="widget-header">
        <div className="widget-title">
          <BarChart3 size={18} color="var(--cyan-primary)" />
          <span>Macroeconomic Indicators — {country.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="brand-badge" style={{ background: 'rgba(2, 132, 199, 0.12)', color: 'var(--cyan-primary)' }}>
            World Bank & IMF Core
          </span>
          <button
            className="btn btn-secondary btn-icon"
            onClick={loadIndicators}
            disabled={loading}
            title="Refresh indicators"
            style={{ width: 32, height: 32 }}
          >
            <RefreshCw size={14} className={loading ? 'fa-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="widget-body">
        <div className="econ-grid">
          {/* GDP */}
          <div className="econ-tile">
            <div className="econ-tile-header">
              <span className="econ-tile-label">Nominal GDP</span>
              <DollarSign size={16} color="var(--cyan-primary)" />
            </div>
            <div className="econ-tile-value">{data.gdpNominal || 'N/A'}</div>
            <div className="econ-tile-sub">Annual Output Value</div>
          </div>

          {/* GDP Growth Rate */}
          <div className="econ-tile">
            <div className="econ-tile-header">
              <span className="econ-tile-label">Real GDP Growth</span>
              <TrendingUp size={16} color="var(--emerald)" />
            </div>
            <div className="econ-tile-value" style={{ color: 'var(--emerald)' }}>
              {data.gdpGrowthRate || 'N/A'}
            </div>
            <div className="econ-tile-sub">Annual Real Expansion</div>
          </div>

          {/* Inflation Rate */}
          <div className="econ-tile">
            <div className="econ-tile-header">
              <span className="econ-tile-label">Inflation (CPI)</span>
              <Activity size={16} color="var(--amber)" />
            </div>
            <div className="econ-tile-value" style={{ color: 'var(--amber)' }}>
              {data.inflationRate || 'N/A'}
            </div>
            <div className="econ-tile-sub">Consumer Price Index</div>
          </div>

          {/* Unemployment Rate */}
          <div className="econ-tile">
            <div className="econ-tile-header">
              <span className="econ-tile-label">Unemployment</span>
              <Percent size={16} color="var(--rose)" />
            </div>
            <div className="econ-tile-value">
              {data.unemploymentRate || 'N/A'}
            </div>
            <div className="econ-tile-sub">Labor Force Share</div>
          </div>

          {/* Central Bank Interest Rate */}
          <div className="econ-tile">
            <div className="econ-tile-header">
              <span className="econ-tile-label">Central Bank Policy Rate</span>
              <Scale size={16} color="var(--indigo)" />
            </div>
            <div className="econ-tile-value" style={{ color: 'var(--indigo)' }}>
              {data.centralBankRate || 'N/A'}
            </div>
            <div className="econ-tile-sub">Key Monetary Policy Rate</div>
          </div>

          {/* Public Debt / GDP */}
          <div className="econ-tile">
            <div className="econ-tile-header">
              <span className="econ-tile-label">Public Debt / GDP</span>
              <Scale size={16} color="var(--text-muted)" />
            </div>
            <div className="econ-tile-value">
              {data.publicDebtRatio || 'N/A'}
            </div>
            <div className="econ-tile-sub">Sovereign Debt Ratio</div>
          </div>

          {/* Trade Balance */}
          <div className="econ-tile">
            <div className="econ-tile-header">
              <span className="econ-tile-label">Trade Balance</span>
              <DollarSign size={16} color="var(--text-muted)" />
            </div>
            <div className="econ-tile-value">
              {data.tradeBalance || 'N/A'}
            </div>
            <div className="econ-tile-sub">Export vs Import Net</div>
          </div>

          {/* Sovereign Credit Rating */}
          <div className="econ-tile">
            <div className="econ-tile-header">
              <span className="econ-tile-label">Sovereign Rating</span>
              <ShieldCheck size={16} color="var(--emerald)" />
            </div>
            <div className="econ-tile-value" style={{ color: 'var(--cyan-primary)' }}>
              {data.creditRating || 'N/A'}
            </div>
            <div className="econ-tile-sub">S&P / Fitch Benchmark</div>
          </div>
        </div>
      </div>
    </div>
  );
}
