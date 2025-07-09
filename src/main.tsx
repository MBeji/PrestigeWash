import './polyfills';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/compatibility.css'
import App from './App-development.tsx'
import { runAllTests } from './utils/browserCompatibilityTest';

// Exécuter les tests de compatibilité en développement
if (import.meta.env.DEV) {
  setTimeout(() => {
    runAllTests().then((results) => {
      console.log('🎯 Tests de compatibilité terminés:', results);
    });
  }, 2000);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
