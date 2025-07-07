const App = () => {
  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#333', marginBottom: '1rem' }}>
          🚗 PrestigeWash VIP - Test Debug
        </h1>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Application en cours de test...
        </p>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#e8f5e8', 
          borderRadius: '4px',
          border: '1px solid #4caf50'
        }}>
          <p style={{ color: '#2e7d32', margin: 0 }}>
            ✅ Si vous voyez ce message, l'application fonctionne !
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
