import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1]));
    return Date.now() / 1000 > exp;
  } catch {
    return true;
  }
}

export function AuthProvider({ children, apiUrl }: { children: ReactNode; apiUrl: string }) {
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem('sa_token');
    if (stored && !isTokenExpired(stored)) return stored;
    localStorage.removeItem('sa_token');
    return null;
  });

  function logout() {
    localStorage.removeItem('sa_token');
    setToken(null);
  }

  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:unauthorized', handler);
    return () => window.removeEventListener('auth:unauthorized', handler);
  }, []);

  async function login(username: string, password: string) {
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error ?? 'Login failed');
    }
    const data = await res.json();
    if (data.role !== 'super_admin') throw new Error('Access denied — super admin only');
    localStorage.setItem('sa_token', data.token);
    setToken(data.token);
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
