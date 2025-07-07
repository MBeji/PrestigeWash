import React, { useState } from 'react';
import { Database, Users } from 'lucide-react';
import { Button } from '../ui/Button';
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
        <div className="auth-mode-switch" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAuthMode('mock')}
            className="auth-mode-button"
            style={{ fontSize: '12px', padding: '4px 8px' }}
          >
            <Users size={14} />
            Mode Dev
          </Button>
        </div>
        <SupabaseLoginForm />
      </div>
    );
  }

  return (
    <div>
      <div className="auth-mode-switch" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAuthMode('supabase')}
          className="auth-mode-button"
          style={{ fontSize: '12px', padding: '4px 8px' }}
        >
          <Database size={14} />
          Mode Prod
        </Button>
      </div>
      
      <LoginForm 
        onLogin={login}
        authorizedUsers={authorizedUsers}
      />
    </div>
  );
};
