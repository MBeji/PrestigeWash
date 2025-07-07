import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Chrome } from 'lucide-react';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';

export const SupabaseLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const { signInWithPassword, signInWithGoogle, resetPassword } = useSupabaseAuth();

  // Vérifier si nous sommes en mode développement
  const isDevelopmentMode = import.meta.env.VITE_SUPABASE_URL?.includes('dummy') || 
                           import.meta.env.VITE_SUPABASE_ANON_KEY?.includes('dummy');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      await signInWithPassword(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;

    setIsLoading(true);
    try {
      const result = await resetPassword(resetEmail);
      if (result.success) {
        setShowResetForm(false);
        setResetEmail('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showResetForm) {
    return (
      <div className="auth-container">
        <Card className="auth-card">
          <CardHeader>
            <CardTitle>Réinitialiser le mot de passe</CardTitle>
            <CardDescription>
              Saisissez votre adresse email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-group">
                <label htmlFor="reset-email" className="form-label">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="form-input"
                  placeholder="votre.email@codir.com"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-actions">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowResetForm(false)}
                  disabled={isLoading}
                >
                  Retour
                </Button>
                <Button
                  type="submit"
                  disabled={!resetEmail || isLoading}
                >
                  {isLoading ? (
                    <Spinner size="sm" text="Envoi..." />
                  ) : (
                    'Envoyer le lien'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <Card className="auth-card">        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🚗 Auto Wash Club VIP</span>
            {/* Badge mode développement compact */}
            {isDevelopmentMode && (
              <div className="dev-mode-badge">
                <Chrome size={12} />
                <span>Dev</span>
              </div>
            )}
          </CardTitle>
          <CardDescription>
            Connexion réservée aux membres du CODIR
          </CardDescription>
        </CardHeader>        <CardContent>
          {/* Connexion Google OAuth */}
          <div className="oauth-section">
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="google-signin-button"
              variant="outline"
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Chrome size={18} />
                  {isDevelopmentMode ? 'Test Google Auth' : 'Se connecter avec Google'}
                </>
              )}
            </Button>
          </div>

          <div className="auth-divider">
            <span>ou</span>
          </div>

          {/* Connexion Email/Mot de passe */}
          <form onSubmit={handleEmailLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} />
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="votre.email@codir.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={16} />
                Mot de passe
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <Button
                type="submit"
                disabled={!email || !password || isLoading}
                className="signin-button"
              >
                {isLoading ? (
                  <Spinner size="sm" text="Connexion..." />
                ) : (
                  'Se connecter'
                )}
              </Button>
            </div>

            <div className="auth-links">
              <button
                type="button"
                onClick={() => setShowResetForm(true)}
                className="auth-link"
                disabled={isLoading}
              >
                Mot de passe oublié ?
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
