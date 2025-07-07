import React from 'react';

const App = () => {
  const [status, setStatus] = React.useState('Chargement...');
  
  React.useEffect(() => {
    setTimeout(() => {
      setStatus('Application chargée avec succès !');
    }, 1000);
  }, []);

  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          🚗
        </div>
        <h1 style={{ 
          color: '#2d3748', 
          marginBottom: '1rem',
          fontSize: '2.5rem',
          fontWeight: 'bold'
        }}>
          PrestigeWash VIP
        </h1>
        <p style={{ 
          color: '#666', 
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          Calendrier de réservations pour Auto Wash Club
        </p>
        
        <div style={{ 
          background: '#f0fff4', 
          padding: '1.5rem', 
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #c6f6d5'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✅</div>
          <p style={{ color: '#2d7d2d', margin: '0', fontWeight: 'bold' }}>
            Déploiement Vercel réussi !
          </p>
          <p style={{ color: '#2d7d2d', margin: '0.5rem 0 0 0' }}>
            {status}
          </p>
        </div>
        
        <div style={{
          background: '#f7fafc',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>
            Informations de déploiement
          </h3>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            <p><strong>URL:</strong> https://prestige-wash-letz.vercel.app/</p>
            <p><strong>Framework:</strong> React 19 + TypeScript + Vite</p>
            <p><strong>Hébergement:</strong> Vercel</p>
            <p><strong>Status:</strong> Opérationnel</p>
          </div>
        </div>
        
        <div style={{
          background: '#fff3cd',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #ffeaa7'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⚙️</div>
          <p style={{ color: '#856404', margin: '0', fontWeight: 'bold' }}>
            Configuration en cours
          </p>
          <p style={{ color: '#856404', margin: '0.5rem 0 0 0' }}>
            Prochaine étape : Configuration Supabase et activation des fonctionnalités complètes
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
