// vercel-build.js - Script de build optimisé pour Vercel
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Build PrestigeWash pour Vercel...');

// Vérifier les variables d'environnement
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

console.log('🔍 Vérification des variables d\'environnement...');
let missingVars = [];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.warn('⚠️  Variables d\'environnement manquantes:', missingVars);
  console.warn('ℹ️  L\'application fonctionnera en mode développement (données mockées)');
} else {
  console.log('✅ Variables d\'environnement configurées');
}

// Exécuter le build
try {
  console.log('🔨 Construction du projet...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build réussi !');
  
  // Vérifier que le dossier dist existe
  if (!fs.existsSync('dist')) {
    throw new Error('Dossier dist non trouvé après le build');
  }
  
  // Vérifier que index.html existe
  if (!fs.existsSync('dist/index.html')) {
    throw new Error('index.html non trouvé dans dist/');
  }
  
  console.log('✅ Fichiers de build vérifiés');
  
} catch (error) {
  console.error('❌ Erreur lors du build:', error.message);
  process.exit(1);
}

console.log('🎉 PrestigeWash est prêt pour le déploiement !');
