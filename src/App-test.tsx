import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { DataProvider } from './contexts/DataContext-dev';
import { AuthModeSelector } from './components/Auth/AuthModeSelector';
import { UserHeader } from './components/Auth/UserHeader';
import { Calendar } from './components/Calendar';

const TestContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthModeSelector />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <header style={{ 
        background: 'white', 
        padding: '1rem 2rem',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: '0', color: '#333', fontSize: '1.5rem' }}>
            🚗 Auto Wash Club VIP
          </h1>
          <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
            Calendrier de réservations - CODIR
          </p>
        </div>
        <UserHeader />
      </header>

      <main style={{ padding: '2rem' }}>
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#007bff', marginBottom: '1rem' }}>
            ✅ Test de l'application complète
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Bonjour <strong>{user?.name}</strong> ({user?.role})
          </p>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Authentification et DataContext-dev fonctionnent. Affichage du calendrier...
          </p>
        </div>

        {user?.canBook ? (
          <Calendar user={user} onBookingCreate={(date, timeSlot) => {
            console.log(`Réservation test: ${date} - ${timeSlot}`);
          }} />
        ) : (
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#ffc107', marginBottom: '1rem' }}>
              👁️ Mode Visualisation
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Vous avez accès au planning en mode visualisation uniquement.
            </p>
            <Calendar user={user} />
          </div>
        )}
      </main>
    </div>
  );
};

function App() {
  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <AuthProvider>
        <ToastProvider>
          <DataProvider>
            <TestContent />
          </DataProvider>
        </ToastProvider>
      </AuthProvider>
    </>
  );
}

export default App;
