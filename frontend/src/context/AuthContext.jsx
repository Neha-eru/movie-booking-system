import React, {
  createContext, useContext,
  useState, useEffect, useCallback
} from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session from localStorage ─────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ── Login ──────────────────────────────────────────────────────
  const login = useCallback((authData) => {
    const userData = {
      userId:   authData.userId,
      username: authData.username,
      email:    authData.email,
      role:     authData.role,
    };
    setToken(authData.token);
    setUser(userData);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user',  JSON.stringify(userData));
  }, []);

  // ── Logout ─────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // ── Helpers ────────────────────────────────────────────────────
  const isAuthenticated = !!token;
  const isAdmin         = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, logout,
      isAuthenticated, isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};