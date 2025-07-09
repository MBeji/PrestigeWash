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
    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Initialisation...');
        
        // Ajouter un délai minimal pour éviter les problèmes de rendu
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const savedUser = localStorage.getItem('autowash_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          console.log('AuthContext: Utilisateur récupéré -', parsedUser.name);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('AuthContext: Erreur lors de la récupération -', error);
        // En cas d'erreur, nettoyer le localStorage
        localStorage.removeItem('autowash_user');
      } finally {
        setIsLoading(false);
        console.log('AuthContext: Chargement terminé');
      }
    };

    initializeAuth();
  }, []);
  const login = (userData: AuthorizedUser) => {
    console.log('Connexion de:', userData.name);
    setUser(userData);
    try {
      localStorage.setItem('autowash_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Erreur sauvegarde localStorage:', error);
    }
  };
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('autowash_user');
    } catch (error) {
      console.error('Erreur suppression localStorage:', error);
    }
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
