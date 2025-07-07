import React from 'react';
import { ToastProvider } from './contexts/ToastContext';

const SimpleTest: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      background: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '1rem' }}>
        🚗 Test Minimal
      </h1>
      
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '1rem'
      }}>
        <h2 style={{ color: '#007bff', marginBottom: '0.5rem' }}>
          ✅ ToastProvider seulement
        </h2>
        <p style={{ margin: '0', lineHeight: '1.5' }}>
          Test avec juste le ToastProvider.
        </p>
      </div>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <SimpleTest />
    </ToastProvider>
  );
}

export default App;
