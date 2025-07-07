#!/bin/bash

# PrestigeWash - Script de déploiement Vercel
# Ce script prépare et déploie l'application sur Vercel

echo "🚀 Déploiement PrestigeWash sur Vercel"
echo "=====================================\n"

# Vérifier la présence des dépendances
echo "📦 Vérification des dépendances..."
if ! command -v npm &> /dev/null; then
    echo "❌ NPM n'est pas installé"
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI n'est pas installé. Installation..."
    npm install -g vercel
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Vérifier le build
echo "🔨 Construction du projet..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Échec du build"
    exit 1
fi

# Vérifier la configuration Vercel
echo "⚙️  Vérification de la configuration Vercel..."
if [ ! -f "vercel.json" ]; then
    echo "❌ Fichier vercel.json manquant"
    exit 1
fi

# Déployer
echo "🚀 Déploiement sur Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi!"
    echo "🎉 PrestigeWash est maintenant en ligne!"
else
    echo "❌ Échec du déploiement"
    exit 1
fi

echo "\n📋 Prochaines étapes:"
echo "1. Configurer les variables d'environnement sur Vercel"
echo "2. Vérifier le fonctionnement de l'application"
echo "3. Tester l'authentification Supabase"
echo "4. Configurer le domaine personnalisé (optionnel)"
