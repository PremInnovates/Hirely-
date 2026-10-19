// context/AuthContext.jsx
// Single source of truth for the logged-in business owner's session.
// Wrap the app in <AuthProvider> (done in App.jsx) and read state via
// the useAuth() hook anywhere in the component tree.

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import authService from '../services/authService';

const TOKEN_KEY = 'workbridge_token';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  // Starts true: on first load we don't yet know if a stored token is
  // still valid, so ProtectedRoute must wait for the /me check below.
  const [loading, setLoading] = useState(true);

  // On mount (and whenever the token changes), verify the token against
  // the backend and load the current user. Handles page refreshes and
  // an expired/invalid token left over in localStorage.
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const me = await authService.getMe();
        if (!cancelled) setUser(me);
      } catch (err) {
        // Token missing/invalid/expired - clear it and fall back to logged out.
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async ({ email, password }) => {
    const data = await authService.login({ email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (formValues) => {
    const data = await authService.register(formValues);
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export default AuthContext;
