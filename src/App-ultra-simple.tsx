import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext-simple';
import { AuthModeSelector } from './components/Auth/AuthModeSelector';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log('AppContent: État -', { isLoading, isAuthenticated, userName: user?.name });

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '12px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗</div>
          <h2 style={{ marginBottom: '1rem' }}>PrestigeWash VIP</h2>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '1rem auto'
          }} />
          <p>Chargement...</p>
          <p style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.7 }}>
            Si cette page reste affichée, il y a un problème avec JavaScript.
          </p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <AuthModeSelector />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', marginBottom: '1rem' }}>
          🚗 PrestigeWash VIP
        </h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Bonjour <strong>{user?.name}</strong> !
        </p>
        <p style={{ color: '#666' }}>
          Vous êtes connecté avec succès. Le calendrier sera affiché ici.
        </p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  console.log('App: Rendu principal');
  
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;