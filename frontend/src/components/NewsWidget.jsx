import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, RefreshCw, Clock, TrendingUp, Globe2 } from 'lucide-react';
import { fetchNews, fetchFinanceNews } from '../api/client';

export default function NewsWidget({ countryName }) {
  const [activeTab, setActiveTab] = useState('yahoo_finance'); // 'yahoo_finance' | 'geopolitics'
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNews = async () => {
    if (!countryName) return;
    setLoading(true);
    try {
      if (activeTab === 'yahoo_finance') {
        const data = await fetchFinanceNews(countryName);
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data);
        } else {
          setArticles(getFallbackFinanceArticles(countryName));
        }
      } else {
        const data = await fetchNews(countryName);
        if (Array.isArray(data) && data.length > 0) {
          setArticles(data);
        } else {
          setArticles(getFallbackGeopoliticalArticles(countryName));
        }
      }
    } catch {
      setArticles(
        activeTab === 'yahoo_finance'
          ? getFallbackFinanceArticles(countryName)
          : getFallbackGeopoliticalArticles(countryName)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [countryName, activeTab]);

  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const diffHrs = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
      if (diffHrs < 1) return 'Just now';
      if (diffHrs === 1) return '1 hour ago';
      if (diffHrs < 24) return `${diffHrs} hours ago`;
      const days = Math.floor(diffHrs / 24);
      return `${days}d ago`;
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="glass-card">
      <div className="widget-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="widget-title">
            <Newspaper size={18} color="var(--cyan-primary)" />
            <span>Wire & Intelligence Dispatch</span>
          </div>

          {/* Dual Feed Tabs */}
          <div className="news-tabs-group">
            <button
              className={`news-tab-btn ${activeTab === 'yahoo_finance' ? 'active' : ''}`}
              onClick={() => setActiveTab('yahoo_finance')}
              title="Filter by Yahoo Finance & Macroeconomics"
            >
              <TrendingUp size={13} />
              <span>Yahoo Finance</span>
            </button>
            <button
              className={`news-tab-btn ${activeTab === 'geopolitics' ? 'active' : ''}`}
              onClick={() => setActiveTab('geopolitics')}
              title="Filter by Geopolitics & Diplomacy"
            >
              <Globe2 size={13} />
              <span>Geopolitics</span>
            </button>
          </div>
        </div>

        <button
          className="btn btn-secondary btn-icon"
          onClick={loadNews}
          disabled={loading}
          title="Refresh headlines"
          style={{ width: 32, height: 32 }}
        >
          <RefreshCw size={14} className={loading ? 'fa-spin' : ''} />
        </button>
      </div>

      <div className="widget-body">
        <div className="news-feed-list">
          {articles.map((art, idx) => (
            <a
              key={idx}
              href={art.url || 'https://finance.yahoo.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card-item"
            >
              <div className="news-meta">
                <span
                  className="news-source-tag"
                  style={{
                    background:
                      art.source?.includes('Yahoo')
                        ? 'rgba(99, 102, 241, 0.15)'
                        : 'rgba(6, 182, 212, 0.12)',
                    color:
                      art.source?.includes('Yahoo')
                        ? 'var(--indigo)'
                        : 'var(--cyan-primary)'
                  }}
                >
                  {art.source || (activeTab === 'yahoo_finance' ? 'Yahoo Finance' : 'Global Wire')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} />
                  {formatTimeAgo(art.publishedAt)}
                </span>
              </div>
              <h4 className="news-title">{art.title}</h4>
              <p className="news-snippet">{art.description}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--cyan-primary)', fontSize: '0.78rem', marginTop: 4 }}>
                <span>{activeTab === 'yahoo_finance' ? 'Open Yahoo Finance Report' : 'Read Full Dispatch'}</span>
                <ExternalLink size={12} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
