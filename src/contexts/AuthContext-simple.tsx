import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthorizedUser } from '../config/authorizedUsers';

interface AuthContextType {
  user: AuthorizedUser | null;
  isAuthenticated: boolean;
  login: (user: AuthorizedUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthorizedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simplifier le chargement initial - forcer la fin du chargement
  useEffect(() => {
    console.log('AuthProvider: Initialisation...');
    
    // Forcer la fin du chargement immédiatement
    setIsLoading(false);
    console.log('AuthProvider: Chargement terminé');
  }, []);

  const login = (userData: AuthorizedUser) => {
    console.log('AuthProvider: Connexion de', userData.name);
    setUser(userData);
    try {
      localStorage.setItem('autowash_user', JSON.stringify(userData));
    } catch (error) {
      console.warn('Impossible de sauvegarder dans localStorage:', error);
    }
  };

  const logout = () => {
    console.log('AuthProvider: Déconnexion');
    setUser(null);
    try {
      localStorage.removeItem('autowash_user');
    } catch (error) {
      console.warn('Impossible de supprimer de localStorage:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  console.log('AuthProvider: État actuel -', { 
    isLoading, 
    isAuthenticated: !!user, 
    userName: user?.name 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
