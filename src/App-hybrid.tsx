import React from 'react';
import { logConfig, getAppMode } from './config/app';

// Composants selon le mode
const ProductionApp = React.lazy(() => import('./App-production'));
const DevelopmentApp = React.lazy(() => import('./App-development'));

const LoadingScreen: React.FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      <p>Chargement de l'application...</p>
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const AppModeSelector: React.FC = () => {
  const [appMode] = React.useState(() => getAppMode());
  
  React.useEffect(() => {
    logConfig();
  }, []);

  return (
    <React.Suspense fallback={<LoadingScreen />}>
      {appMode === 'production' ? (
        <ProductionApp />
      ) : (
        <DevelopmentApp />
      )}
    </React.Suspense>
  );
};

export default AppModeSelector;
