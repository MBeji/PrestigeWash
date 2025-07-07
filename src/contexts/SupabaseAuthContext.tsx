import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import type { SupabaseUser } from '../lib/supabase';
import type { AuthError } from '@supabase/supabase-js';

interface AuthContextType {
  user: SupabaseUser | null;
  loading: boolean;
  error: AuthError | null;
  signInWithPassword: (email: string, password: string) => Promise<{ success: boolean; error?: AuthError }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: AuthError }>;
  signOut: () => Promise<{ success: boolean; error?: AuthError }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: AuthError }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const SupabaseAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useSupabaseAuth();

  const value = {
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    signInWithPassword: auth.signInWithPassword,
    signInWithGoogle: auth.signInWithGoogle,
    signOut: auth.signOut,
    resetPassword: auth.resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
