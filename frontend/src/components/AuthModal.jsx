import React, { useState } from 'react';
import { X, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

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
      if (isRegisterMode) {
        await register(username, password);
        setSuccessMsg('Account created successfully! Logging you in...');
        // Auto-login after registration
        setTimeout(async () => {
          await login(username, password);
          onClose();
        }, 800);
      } else {
        await login(username, password);
        setSuccessMsg('Authenticated successfully!');
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 700, color: '#fff' }}>
            {isRegisterMode ? 'Create Analyst Account' : 'Welcome to WorldWatch'}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            {isRegisterMode
              ? 'Register to sync your custom watchlist and save preferences across devices.'
              : 'Sign in to access protected intelligence feeds and personalized favorites.'}
          </p>
        </div>

        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--rose)', fontSize: '0.84rem' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-sm)', color: 'var(--emerald)', fontSize: '0.84rem' }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="auth-form-group">
            <label>Username</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0 12px' }}>
              <User size={16} color="var(--text-muted)" />
              <input
                type="text"
                className="auth-input"
                style={{ border: 'none', background: 'transparent', padding: '10px 0', width: '100%' }}
                placeholder="e.g. analyst_01"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0 12px' }}>
              <Lock size={16} color="var(--text-muted)" />
              <input
                type="password"
                className="auth-input"
                style={{ border: 'none', background: 'transparent', padding: '10px 0', width: '100%' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px 0', marginTop: 8 }}
          >
            {loading ? 'Authenticating...' : (isRegisterMode ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="auth-toggle-link" onClick={() => {
          setIsRegisterMode(!isRegisterMode);
          setErrorMsg('');
          setSuccessMsg('');
        }}>
          {isRegisterMode
            ? 'Already have an account? Sign in here'
            : "Don't have an account yet? Register now"}
        </div>
      </div>
    </div>
  );
}
