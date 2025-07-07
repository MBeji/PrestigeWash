import React from 'react';

export const TestComponent = () => {
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
      <h2>🧪 Test Component</h2>
      <p>Si vous voyez ce message, les composants React fonctionnent correctement.</p>
      <div style={{ marginTop: '10px' }}>
        <button style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Bouton de test
        </button>
      </div>
    </div>
  );
};
