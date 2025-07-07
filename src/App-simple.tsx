import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      background: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '1rem' }}>
        🚗 Auto Wash Club VIP - Test
      </h1>
      
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '1rem'
      }}>
        <h2 style={{ color: '#007bff', marginBottom: '0.5rem' }}>
          ✅ Application fonctionne !
        </h2>
        <p style={{ margin: '0', lineHeight: '1.5' }}>
          Si vous voyez ce message, React fonctionne correctement.
        </p>
      </div>

      <div style={{ 
        background: '#d4edda', 
        padding: '15px', 
        borderRadius: '4px',
        border: '1px solid #c3e6cb',
        color: '#155724'
      }}>
        <strong>Status :</strong> Serveur démarré sur <code>http://localhost:5185</code>
      </div>

      <button 
        style={{
          marginTop: '1rem',
          padding: '10px 20px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
        onClick={() => alert('Test button fonctionne !')}
      >
        🧪 Test Button
      </button>
    </div>
  );
}

export default App;
