import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

export type Role = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API = 'http://localhost:8000';

// ── Axios interceptor global (une seule fois) ──────────────────
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user');
        localStorage.removeItem('mockUser');
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Étape 1 : récupérer le token
      const { data: tokenData } = await axios.post<{ access_token: string; token_type: string }>(
        `${API}/api/auth/login`,
        { email, password }
      );

      // Sauvegarder le token (l'interceptor va l'utiliser automatiquement après)
      localStorage.setItem('token', tokenData.access_token);

      // Étape 2 : récupérer le profil utilisateur
      const { data: userData } = await axios.get<User>(`${API}/api/users/me`);

      setUser(userData);
      localStorage.setItem('mockUser', JSON.stringify(userData));
      setIsLoading(false);
      return true;

    } catch (err) {
      console.error('Login failed:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('mockUser');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
