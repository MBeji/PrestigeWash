import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { DataProvider } from './contexts/DataContext';

const TestWithContexts: React.FC = () => {
  return (
    <div style={{ 
      padding: '20px', 
      background: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif' 
    }}>
      <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '1rem' }}>
        🚗 Auto Wash Club VIP - Test avec Contextes
      </h1>
      
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '1rem'
      }}>
        <h2 style={{ color: '#007bff', marginBottom: '0.5rem' }}>
          ✅ Contextes chargés !
        </h2>
        <p style={{ margin: '0', lineHeight: '1.5' }}>
          AuthProvider, ToastProvider et DataProvider fonctionnent.
        </p>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <DataProvider>
          <TestWithContexts />
        </DataProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
