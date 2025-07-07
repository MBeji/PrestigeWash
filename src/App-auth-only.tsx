import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthModeSelector } from './components/Auth/AuthModeSelector';
import { UserHeader } from './components/Auth/UserHeader';

const AppContent: React.FC = () => {
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
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#007bff', marginBottom: '1rem' }}>
            ✅ Authentification fonctionne !
          </h2>
          <p style={{ marginBottom: '1rem' }}>
            Bonjour <strong>{user?.name}</strong> ({user?.role})
          </p>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            L'authentification et les contextes de base fonctionnent.
            Le problème semble être dans le DataContext ou les hooks Supabase.
          </p>
        </div>
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
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </>
  );
}

export default App;
