import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Version de debugging minimale pour identifier le problème
console.log('[DEBUG] 1. Début du chargement main.tsx');

// Test si les imports de base fonctionnent
try {
  console.log('[DEBUG] 2. Imports de base OK');
  
  // Test si le DOM est prêt
  const rootElement = document.getElementById('root');
  console.log('[DEBUG] 3. Root element:', rootElement);
  
  if (!rootElement) {
    console.error('[ERROR] Root element non trouvé');
    throw new Error('Root element non trouvé');
  }
  
  // Test si React peut créer une root
  const root = createRoot(rootElement);
  console.log('[DEBUG] 4. React root créée:', root);
  
  // Version ultra-minimale pour test
  const TestApp = () => {
    console.log('[DEBUG] 5. TestApp rendu');
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>🚗 PrestigeWash - Test Mode</h1>
        <p>Si vous voyez ce message, React fonctionne correctement.</p>
        <p>Timestamp: {new Date().toISOString()}</p>
      </div>
    );
  };
  
  console.log('[DEBUG] 6. Début du rendu React');
  
  root.render(
    <StrictMode>
      <TestApp />
    </StrictMode>
  );
  
  console.log('[DEBUG] 7. Rendu React terminé avec succès');
  
} catch (error) {
  console.error('[ERROR] Erreur dans main.tsx:', error);
  
  // Fallback d'urgence
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: red; font-family: Arial, sans-serif;">
        <h1>🚨 Erreur de chargement</h1>
        <p>Erreur détectée: ${(error as Error).message}</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
        <button onclick="location.reload()">Recharger</button>
      </div>
    `;
  }
}
