import React, { useState } from 'react';
import {
  Globe,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignInPage({ onNavigateToHome, onNavigateToDashboard }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isRegister) {
        await register(username, password);
        setSuccessMsg('Account created successfully! Signing in...');
        setTimeout(async () => {
          await login(username, password);
          onNavigateToDashboard();
        }, 700);
      } else {
        await login(username, password);
        setSuccessMsg('Authentication verified! Launching terminal...');
        setTimeout(() => {
          onNavigateToDashboard();
        }, 500);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setUsername('Analyst_Demo');
    setPassword('DemoPass123!');
    setErrorMsg('');
  };

  return (
    <div className="signin-page-container">
      {/* Background radial glow */}
      <div className="landing-glow glow-top-center" style={{ opacity: 0.15 }} />

      <div className="signin-split-card glass-card">
        {/* Left Side: FinTech Value Prop & Badges */}
        <div className="signin-info-panel">
          <div className="brand" onClick={onNavigateToHome} style={{ cursor: 'pointer' }}>
            <div className="brand-icon-wrapper">
              <Globe size={22} />
            </div>
            <div>
              <span className="brand-title">WORLD WATCH</span>
              <span className="brand-badge" style={{ marginLeft: 8 }}>ENTERPRISE</span>
            </div>
          </div>

          <div className="signin-pitch">
            <h2>The unified intelligence terminal for global decision makers.</h2>
            <p>
              Join financial analysts, traders, and geopolitical strategists tracking
              currencies, sovereign data, and real-time world events.
            </p>
          </div>

          <div className="signin-benefits-list">
            <div className="benefit-item">
              <CheckCircle2 size={18} color="var(--cyan-primary)" />
              <span>Real-time spot rates across 160+ fiat currencies</span>
            </div>
            <div className="benefit-item">
              <CheckCircle2 size={18} color="var(--emerald)" />
              <span>Targeted geopolitical news direct wire</span>
            </div>
            <div className="benefit-item">
              <CheckCircle2 size={18} color="var(--amber)" />
              <span>Gemini AI contextual country analysis</span>
            </div>
            <div className="benefit-item">
              <CheckCircle2 size={18} color="var(--indigo)" />
              <span>Personalized encrypted watchlist sync</span>
            </div>
          </div>

          <div className="signin-security-footer">
            <ShieldCheck size={18} color="var(--emerald)" />
            <span>256-Bit Stateless JWT • Spring Security Architecture</span>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="signin-form-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn btn-secondary" onClick={onNavigateToHome} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </button>
            <button 
              className="quick-demo-btn"
              type="button" 
              onClick={fillDemoAccount}
              title="Click to fill instant demo credentials"
            >
              <KeyRound size={13} />
              <span>Fill Demo Credentials</span>
            </button>
          </div>

          <div className="signin-header-block">
            <h1 className="signin-title">
              {isRegister ? 'Create Analyst Account' : 'Sign in to Terminal'}
            </h1>
            <p className="signin-subtitle">
              {isRegister
                ? 'Register your profile to synchronize custom country watchlists.'
                : 'Enter your credentials to access protected global intelligence feeds.'}
            </p>
          </div>

          {/* Error / Success Alerts */}
          {errorMsg && (
            <div className="auth-alert error">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-alert success">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="signin-form">
            <div className="form-group">
              <label>Username</label>
              <div className="input-icon-box">
                <User size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="e.g. analyst_01"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-box">
                <Lock size={16} color="var(--text-muted)" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-submit-auth"
              disabled={loading}
            >
              {loading ? (
                <span>Verifying Authentication...</span>
              ) : (
                <>
                  <span>{isRegister ? 'Create Account & Launch' : 'Authenticate & Launch Terminal'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Sign In & Register */}
          <div className="auth-switch-prompt">
            {isRegister ? (
              <span>
                Already have an analyst account?{' '}
                <a onClick={() => { setIsRegister(false); setErrorMsg(''); }}>
                  Sign in here
                </a>
              </span>
            ) : (
              <span>
                Don't have an analyst account yet?{' '}
                <a onClick={() => { setIsRegister(true); setErrorMsg(''); }}>
                  Register here
                </a>
              </span>
            )}
          </div>

          {/* Skip directly to guest terminal */}
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <span
              style={{ fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={onNavigateToDashboard}
            >
              Or proceed as Guest Analyst without sign-in &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
