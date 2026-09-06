import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getAuthToken,
  setAuthToken,
  getStoredUser,
  setStoredUser,
  login as apiLogin,
  register as apiRegister
} from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getAuthToken());
  const [user, setUser] = useState(getStoredUser());
  const [isDemoMode, setIsDemoMode] = useState(!token);

  useEffect(() => {
    // If no token exists at start, initialize a guest / demo analyst profile for seamless experience
    if (!token && !user) {
      const demoUser = { username: 'Analyst_Guest', id: 'guest' };
      setUser(demoUser);
      setStoredUser(demoUser);
      setIsDemoMode(true);
    }
  }, [token, user]);

  const loginUser = async (username, password) => {
    try {
      const res = await apiLogin(username, password);
      if (res && res.token) {
        setToken(res.token);
        setAuthToken(res.token);
        const loggedUser = { username, id: res.id || 1 };
        setUser(loggedUser);
        setStoredUser(loggedUser);
        setIsDemoMode(false);
        return { success: true };
      }
    } catch (err) {
      // If backend is offline or credentials error
      console.warn('Backend login attempt failed:', err.message);
      // If user is intentionally running offline/demo, allow quick demo login
      if (err.status === 400 || err.status === 401) {
        throw new Error(err.message || 'Invalid username or password');
      } else {
        // Backend offline fallback
        const mockToken = 'mock-jwt-token-' + Date.now();
        setToken(mockToken);
        setAuthToken(mockToken);
        const loggedUser = { username, id: 999 };
        setUser(loggedUser);
        setStoredUser(loggedUser);
        setIsDemoMode(true);
        return { success: true, isDemo: true };
      }
    }
  };

  const registerUser = async (username, password) => {
    try {
      const res = await apiRegister(username, password);
      return { success: true, data: res };
    } catch (err) {
      if (err.status === 400) {
        throw new Error(err.message || 'Username is already taken');
      } else {
        // Backend offline fallback
        return { success: true, isDemo: true };
      }
    }
  };

  const logoutUser = () => {
    setToken(null);
    setAuthToken(null);
    const guestUser = { username: 'Analyst_Guest', id: 'guest' };
    setUser(guestUser);
    setStoredUser(guestUser);
    setIsDemoMode(true);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isDemoMode,
        setIsDemoMode,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
        isAuthenticated: !!token && !isDemoMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
