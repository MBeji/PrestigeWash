import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Chrome } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import type { AuthorizedUser } from '../../config/authorizedUsers';

interface LoginFormProps {
  onLogin: (user: AuthorizedUser) => void;
  authorizedUsers: AuthorizedUser[];
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, authorizedUsers }) => {
  const [selectedUser, setSelectedUser] = useState<AuthorizedUser | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'password'>('select');

  const handleUserSelect = (user: AuthorizedUser) => {
    setSelectedUser(user);
    setStep('password');
    setError('');
  };

  const handleBackToSelect = () => {
    setStep('select');
    setSelectedUser(null);
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setError('');
    setIsLoading(true);

    try {
      // Simulation de vérification du mot de passe
      if (password.length < 4) {
        setError('Mot de passe trop court. Minimum 4 caractères.');
        setIsLoading(false);
        return;
      }

      // Simulation d'un délai d'authentification
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Connexion réussie
      onLogin(selectedUser);
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Simulation d'authentification Google
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Pour la démo, on connecte automatiquement Dorsaf (CEO)
      const dorsaf = authorizedUsers.find(u => u.name === 'Dorsaf');
      if (dorsaf) {
        onLogin(dorsaf);
      } else {
        setError('Erreur lors de l\'authentification Google.');
      }
    } catch (err) {
      setError('Erreur lors de l\'authentification Google.');
    } finally {
      setIsLoading(false);
    }
  };

  // Séparer les utilisateurs par catégorie
  const codirMembers = authorizedUsers.filter(u => u.role === 'ceo' || u.role === 'director');
  const viewers = authorizedUsers.filter(u => u.role === 'viewer');

  return (
    <div className="login-container">
      <Card className="login-card">
        <CardHeader className="login-header">
          <div className="login-logo">
            <div className="logo-icon">🚗</div>
          </div>
          <CardTitle>Auto Wash Club VIP</CardTitle>
          <CardDescription>
            Calendrier de réservations - Membres du CODIR
          </CardDescription>
        </CardHeader>

        <CardContent className="login-content">
          {step === 'select' ? (
            // Étape 1: Sélection de l'utilisateur
            <div className="user-selection">
              <h3 className="selection-title">
                <User style={{ width: '18px', height: '18px' }} />
                Sélectionnez votre nom
              </h3>
              
              <div className="users-category">
                <h4 className="category-title">👑 Membres du CODIR</h4>
                <div className="users-grid">
                  {codirMembers.map(user => (
                    <div
                      key={user.id}
                      className="user-card"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="user-card-icon">
                        {user.role === 'ceo' ? '👑' : '🎯'}
                      </div>
                      <div className="user-card-info">
                        <div className="user-card-name">{user.name}</div>
                        <div className="user-card-title">{user.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {viewers.length > 0 && (
                <div className="users-category">
                  <h4 className="category-title">👁️ Accès Visualisation</h4>
                  <div className="users-grid">
                    {viewers.map(user => (
                      <div
                        key={user.id}
                        className="user-card viewer-card"
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="user-card-icon">👁️</div>
                        <div className="user-card-info">
                          <div className="user-card-name">{user.name}</div>
                          <div className="user-card-title">{user.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="login-divider">
                <span>ou</span>
              </div>

              <Button
                variant="outline"
                onClick={handleGoogleLogin}
                className="google-login-button"
                disabled={isLoading}
              >
                <Chrome style={{ width: '16px', height: '16px' }} />
                {isLoading ? 'Connexion Google...' : 'Continuer avec Google'}
              </Button>
            </div>
          ) : (
            // Étape 2: Saisie du mot de passe
            <div className="password-step">
              <div className="selected-user-info">
                <div className="selected-user-avatar">
                  {selectedUser?.role === 'ceo' ? '👑' : 
                   selectedUser?.role === 'director' ? '🎯' : '👁️'}
                </div>
                <div className="selected-user-details">
                  <div className="selected-user-name">{selectedUser?.name}</div>
                  <div className="selected-user-title">{selectedUser?.title}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToSelect}
                  className="change-user-button"
                >
                  Changer
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="password-form">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    <Lock style={{ width: '16px', height: '16px' }} />
                    Mot de passe
                  </label>
                  <div className="input-container password-container">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Entrez votre mot de passe"
                      className="form-input"
                      autoComplete="current-password"
                      autoFocus
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 
                        <EyeOff style={{ width: '16px', height: '16px' }} /> : 
                        <Eye style={{ width: '16px', height: '16px' }} />
                      }
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    ⚠️ {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="login-button"
                  disabled={isLoading || !password}
                >
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </form>
            </div>
          )}

          <div className="login-help">
            <p className="help-text">
              🔒 Accès réservé aux membres du CODIR et utilisateurs autorisés
            </p>
            <p className="contact-text">
              Problème de connexion ? Contactez l'administrateur système
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
