import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent mock session
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let authenticatedUser: User | null = null;

    if (email === 'admin@gmail.com' && password === '123456') {
      authenticatedUser = {
        id: '1',
        name: 'Admin User',
        email: 'admin@gmail.com',
        role: 'admin',
      };
    } else if (email === 'user@gmail.com' && password === '123456') {
      authenticatedUser = {
        id: '2',
        name: 'Sayf Eddine',
        email: 'user@gmail.com',
        role: 'user',
      };
    }

    if (authenticatedUser) {
      setUser(authenticatedUser);
      localStorage.setItem('mockUser', JSON.stringify(authenticatedUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
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
