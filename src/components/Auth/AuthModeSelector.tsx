import React, { useState } from 'react';
import { Settings, Database, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { LoginForm } from './LoginForm';
import { SupabaseLoginForm } from './SupabaseLoginForm';
import { useAuth } from '../../contexts/AuthContext';
import { authorizedUsers } from '../../config/authorizedUsers';

type AuthMode = 'mock' | 'supabase';

export const AuthModeSelector: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('mock');
  const { login } = useAuth();

  if (authMode === 'supabase') {
    return (
      <div>
        <div className="auth-mode-switch">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAuthMode('mock')}
            className="auth-mode-button"
          >
            <Users size={16} />
            Mode Développement
          </Button>
        </div>
        <SupabaseLoginForm />
      </div>
    );
  }

  return (
    <div>
      <div className="auth-mode-switch">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAuthMode('supabase')}
          className="auth-mode-button"
        >
          <Database size={16} />
          Mode Production (Supabase)
        </Button>
      </div>
      
      <LoginForm 
        onLogin={login}
        authorizedUsers={authorizedUsers}
      />
      
      {/* Banner d'information sur le mode développement */}
      <div className="dev-mode-banner">
        <Card className="dev-banner-card">
          <CardHeader>
            <CardTitle className="dev-banner-title">
              <Settings size={18} />
              Mode Développement
            </CardTitle>
            <CardDescription>
              Authentification simulée pour le développement. 
              Basculez vers "Mode Production" pour utiliser Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="dev-features">
              <div className="dev-feature">
                ✅ <strong>Authentification simulée</strong> - Aucune configuration requise
              </div>
              <div className="dev-feature">
                ✅ <strong>Utilisateurs prédéfinis</strong> - 11 membres CODIR + 2 viewers
              </div>
              <div className="dev-feature">
                ⚡ <strong>Développement rapide</strong> - Pas besoin de base de données
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
