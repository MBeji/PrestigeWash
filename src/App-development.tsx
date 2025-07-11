import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { SmartDataProvider } from './contexts/SmartDataProvider';
import { AuthModeSelector } from './components/Auth/AuthModeSelector';
import { UserHeader } from './components/Auth/UserHeader';
import { Calendar } from './components/Calendar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BrowserCompatibilityChecker } from './components/BrowserCompatibilityChecker';
import { ConnectionStatus } from './components/ConnectionStatus';
import { SupabaseStatus } from './components/SupabaseStatus';
import OAuthCallbackHandler from './components/Auth/OAuthCallbackHandler';

console.log('🚀 [App-dev] Import terminé');

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-background">
          <OAuthCallbackHandler>
            <AuthModeSelector />
          </OAuthCallbackHandler>
        </div>
      </div>
    );  }

  const handleBookingCreate = (date: string, timeSlot: string) => {
    console.log(`Nouvelle réservation: ${user?.name} - ${date} - ${timeSlot}`);
  };
  return (
    <div className="app">
      <BrowserCompatibilityChecker />
      <header className="app-header">
        <div className="app-title">
          <h1>🚗 Auto Wash Club VIP</h1>
          <p>Calendrier de réservations - CODIR (Mode Développement)</p>
        </div>
        <UserHeader />
      </header>      <main className="app-main">
        <div className="development-notice">
          <div className="notice-card">
            <h3>🔧 Mode Développement Actif</h3>
            <p>
              L'application fonctionne avec des données simulées. 
              Configurez Supabase pour activer le mode production.
            </p>
          </div>
        </div>

        {/* Affichage du statut de connexion */}
        <ConnectionStatus showDetails={true} className="mb-6" />
        
        {/* Statut Supabase */}
        <SupabaseStatus className="mb-6" />

        {user?.canBook ? (
          <Calendar user={user} onBookingCreate={handleBookingCreate} />
        ) : (
          <div className="viewer-notice">
            <div className="notice-card">
              <h2>👁️ Mode Visualisation</h2>
              <p>
                Bonjour <strong>{user?.name}</strong>, vous avez accès au planning en mode visualisation uniquement.
              </p>
              <p>
                Vous pouvez consulter toutes les réservations mais ne pouvez pas effectuer de nouvelles réservations.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

function AppDevelopment() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <SmartDataProvider>
            <AppContent />
          </SmartDataProvider>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default AppDevelopment;
