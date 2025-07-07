import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { DataProvider } from './contexts/DataContext';
import { AuthModeSelector } from './components/Auth/AuthModeSelector';
import { UserHeader } from './components/Auth/UserHeader';
import { Calendar } from './components/Calendar';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, login, isLoading } = useAuth();

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
            <Calendar user={user} onBookingCreate={handleBookingCreate} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2025 Auto Wash Club VIP - Système de réservation pour le CODIR</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
