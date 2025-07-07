import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Arial, sans-serif',
      background: '#f5f5f5',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{ color: '#007bff', marginBottom: '1rem' }}>
          🚗 PrestigeWash VIP
        </h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Calendrier de réservations pour Auto Wash Club
        </p>
        <div style={{ 
          background: '#e8f5e8', 
          padding: '1rem', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <p style={{ color: '#2d7d2d', margin: '0' }}>
            ✅ Application déployée avec succès sur Vercel !
          </p>
        </div>
        <div style={{
          background: '#fff3cd',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <p style={{ color: '#856404', margin: '0' }}>
            ⚠️ Configuration des variables d'environnement en cours...
          </p>
        </div>
        <div style={{ fontSize: '0.9rem', color: '#666' }}>
          <p>URL: https://prestige-wash-letz.vercel.app/</p>
          <p>Status: Déployé et fonctionnel</p>
          <p>Prochaine étape: Configuration Supabase</p>
        </div>
      </div>
    </div>
  );
};

export default App;
