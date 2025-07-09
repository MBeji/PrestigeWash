import './polyfills';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/compatibility.css'
import App from './App-development.tsx'

console.log('🚀 [1] Main.tsx: Démarrage de l\'application');

// Version avec debugging détaillé
function DebugApp() {
  console.log('🔍 [2] DebugApp: Début du composant');
  
  try {
    console.log('🔍 [3] DebugApp: Tentative d\'import de App');
    return <App />;
  } catch (error) {
    console.error('❌ [ERROR] DebugApp: Erreur lors du rendu de App:', error);
    return (
      <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
        <h1>� Erreur dans l'application</h1>
        <p>Une erreur s'est produite lors du chargement de l'application principale.</p>
        <pre style={{ background: '#f0f0f0', padding: '1rem', marginTop: '1rem' }}>
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    );
  }
}

console.log('🎯 [4] Main.tsx: Tentative de montage de React');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ [ERROR] Élément root non trouvé !');
} else {
  console.log('✅ [5] Élément root trouvé, création de createRoot');
  
  try {
    const root = createRoot(rootElement);
    console.log('✅ [6] createRoot créé avec succès');
    
    root.render(
      <StrictMode>
        <DebugApp />
      </StrictMode>
    );
    
    console.log('✅ [7] Application montée avec succès');
  } catch (error) {
    console.error('❌ [ERROR] Erreur lors du montage de React:', error);
  }
}
