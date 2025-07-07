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

  // Vérifier si l'utilisateur est déjà connecté au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('autowash_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        localStorage.removeItem('autowash_user');
      }
    }
    setIsLoading(false);
  }, []);
  const login = (userData: AuthorizedUser) => {
    console.log('🔐 Tentative de connexion avec:', userData);
    setUser(userData);
    localStorage.setItem('autowash_user', JSON.stringify(userData));
    
    // Log de connexion (en production, envoyer au serveur)
    console.log(`✅ Connexion réussie: ${userData.name} (${userData.title}) à ${new Date().toLocaleString()}`);
  };

  const logout = () => {
    if (user) {
      console.log(`Déconnexion de ${user.name} à ${new Date().toLocaleString()}`);
    }
    setUser(null);
    localStorage.removeItem('autowash_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
