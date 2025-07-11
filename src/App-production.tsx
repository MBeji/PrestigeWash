import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { SmartDataProvider } from './contexts/SmartDataProvider';
import { AuthModeSelector } from './components/Auth/AuthModeSelector';
import { UserHeader } from './components/Auth/UserHeader';
import { Calendar } from './components/Calendar';

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
    return <AuthModeSelector />;
  }

  const handleBookingCreate = (date: string, timeSlot: string) => {
    console.log(`Nouvelle réservation: ${user?.name} - ${date} - ${timeSlot}`);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <h1>🚗 Auto Wash Club VIP</h1>
          <p>Calendrier de réservations - CODIR</p>
        </div>
        <UserHeader />
      </header>

      <main className="app-main">
        <div className="production-notice">
          <div className="notice-card success">
            <h3>✅ Mode Production Actif</h3>
            <p>
              Connecté à Supabase - Données en temps réel
            </p>
          </div>
        </div>

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

function AppProduction() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SmartDataProvider>
          <AppContent />
        </SmartDataProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default AppProduction;
