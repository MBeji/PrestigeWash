import './polyfills';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/compatibility.css'
import App from './App-development.tsx'

console.log('🚀 [MAIN] Démarrage de l\'application');
console.log('🔧 [MAIN] Variables d\'environnement:', {
  NODE_ENV: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  DEV: import.meta.env.DEV,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'Définie' : 'Non définie',
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Définie' : 'Non définie'
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ [MAIN] Élément root non trouvé !');
} else {
  console.log('✅ [MAIN] Élément root trouvé, création de createRoot');
  
  try {
    const root = createRoot(rootElement);
    console.log('✅ [MAIN] createRoot créé avec succès');
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    console.log('✅ [MAIN] Application montée avec succès');
  } catch (error) {
    console.error('❌ [MAIN] Erreur lors du montage de React:', error);
    
    // Fallback d'urgence
    rootElement.innerHTML = `
      <div style="padding: 2rem; color: red; font-family: Arial, sans-serif;">
        <h1>🚨 Erreur de chargement</h1>
        <p>Erreur: ${error instanceof Error ? error.message : String(error)}</p>
        <button onclick="location.reload()">Recharger</button>
      </div>
    `;
  }
}
