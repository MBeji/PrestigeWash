#!/bin/bash

# 🧪 Script de test pour l'authentification Google OAuth avec Supabase

echo "🚀 Test de l'authentification Google OAuth - PrestigeWash"
echo "=========================================================="

# 1. Vérifier les variables d'environnement
echo ""
echo "1. Vérification des variables d'environnement:"
echo "----------------------------------------------"

if [ -f ".env.local" ]; then
  echo "✅ Fichier .env.local trouvé"
  
  # Vérifier la présence des variables
  if grep -q "VITE_SUPABASE_URL=" .env.local; then
    URL=$(grep "VITE_SUPABASE_URL=" .env.local | cut -d'=' -f2)
    if [[ $URL == *"dummy"* ]]; then
      echo "❌ URL Supabase: Mode développement (dummy)"
    else
      echo "✅ URL Supabase: Production configurée"
    fi
  else
    echo "❌ VITE_SUPABASE_URL non définie"
  fi
  
  if grep -q "VITE_SUPABASE_ANON_KEY=" .env.local; then
    KEY=$(grep "VITE_SUPABASE_ANON_KEY=" .env.local | cut -d'=' -f2)
    if [[ $KEY == *"dummy"* ]]; then
      echo "❌ Clé Supabase: Mode développement (dummy)"
    else
      echo "✅ Clé Supabase: Production configurée"
    fi
  else
    echo "❌ VITE_SUPABASE_ANON_KEY non définie"
  fi
else
  echo "❌ Fichier .env.local non trouvé"
fi

# 2. Vérifier l'état de l'application
echo ""
echo "2. État de l'application:"
echo "-------------------------"

if [ -f "src/hooks/useSupabaseAuth.ts" ]; then
  echo "✅ Hook useSupabaseAuth.ts présent"
else
  echo "❌ Hook useSupabaseAuth.ts manquant"
fi

if [ -f "src/components/Auth/OAuthCallbackHandler.tsx" ]; then
  echo "✅ Composant OAuthCallbackHandler.tsx présent"
else
  echo "❌ Composant OAuthCallbackHandler.tsx manquant"
fi

if [ -f "src/components/Auth/ProductionAuth.tsx" ]; then
  echo "✅ Composant ProductionAuth.tsx présent"
else
  echo "❌ Composant ProductionAuth.tsx manquant"
fi

# 3. Instructions pour tester
echo ""
echo "3. Instructions pour tester l'authentification Google:"
echo "-----------------------------------------------------"

echo "🔧 Mode Développement (avec variables dummy):"
echo "   1. Lancez l'application: npm run dev"
echo "   2. Cliquez sur 'Se connecter avec Google'"
echo "   3. Vérifiez la simulation (délai 1s + utilisateur fictif)"
echo ""

echo "🔒 Mode Production (avec Supabase réel):"
echo "   1. Configurez les vraies variables d'environnement"
echo "   2. Configurez Google OAuth dans Supabase Dashboard"
echo "   3. Ajoutez les URLs de redirection"
echo "   4. Testez la connexion réelle"
echo ""

echo "🌐 URLs de redirection à configurer:"
echo "   - Développement: http://localhost:5173/auth/callback"
echo "   - Production: https://votre-domaine.com/auth/callback"
echo ""

# 4. Vérifier si le serveur de développement est en cours
echo "4. État du serveur de développement:"
echo "-----------------------------------"

if lsof -i :5173 > /dev/null 2>&1; then
  echo "✅ Serveur de développement détecté sur le port 5173"
  echo "   URL: http://localhost:5173"
else
  echo "❌ Serveur de développement non détecté"
  echo "   Lancez: npm run dev"
fi

# 5. Liens utiles
echo ""
echo "5. Liens utiles:"
echo "----------------"
echo "📚 Documentation Supabase: https://supabase.com/docs/guides/auth"
echo "🔧 Google Cloud Console: https://console.cloud.google.com"
echo "📖 Guide complet: docs/GOOGLE_OAUTH_SETUP.md"
echo ""
echo "🎉 Test terminé ! Consultez le guide pour plus d'informations."
echo "=========================================================="
