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
  const [isLoading, setIsLoading] = useState(true);  // Vérifier si l'utilisateur est déjà connecté au démarrage
  useEffect(() => {
    console.log('AuthContext: Initialisation...');
    
    // Simplifier le chargement pour éviter les problèmes
    try {
      const savedUser = localStorage.getItem('autowash_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        console.log('AuthContext: Utilisateur récupéré -', parsedUser.name);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('AuthContext: Erreur lors de la récupération -', error);
    }
    
    // Forcer la fin du chargement
    setIsLoading(false);
    console.log('AuthContext: Chargement terminé');
  }, []);

  const login = (userData: AuthorizedUser) => {
    try {
      console.log('Début de la connexion pour:', userData.name);
      setUser(userData);
      
      // Vérifier si localStorage est disponible
      if (typeof Storage !== 'undefined' && localStorage) {
        localStorage.setItem('autowash_user', JSON.stringify(userData));
        console.log('Utilisateur sauvegardé dans localStorage');
      } else {
        console.warn('localStorage non disponible - utilisation de sessionStorage');
        if (sessionStorage) {
          sessionStorage.setItem('autowash_user', JSON.stringify(userData));
        }
      }
      
      console.log('Connexion terminée avec succès');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      // Même en cas d'erreur de storage, on connecte l'utilisateur
      setUser(userData);
    }
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
