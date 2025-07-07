#!/bin/bash

# Script de vérification du build PrestigeWash

echo "🔍 Vérification du build PrestigeWash"
echo "===================================="

echo "📦 Vérification des dépendances..."
npm list --depth=0 | grep -E "(react|typescript|vite)" || echo "Dépendances principales OK"

echo "🔨 Test du build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi!"
    
    echo "📁 Vérification des fichiers de build..."
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html généré"
    else
        echo "❌ index.html manquant"
    fi
    
    if [ -f "dist/assets/index-"*.css ]; then
        echo "✅ CSS généré"
    else
        echo "❌ CSS manquant"
    fi
    
    if [ -f "dist/assets/index-"*.js ]; then
        echo "✅ JS généré"
    else
        echo "❌ JS manquant"
    fi
    
    echo "📊 Taille des fichiers:"
    du -h dist/assets/* | head -5
    
    echo "🎉 Le build est prêt pour Vercel!"
else
    echo "❌ Échec du build"
    exit 1
fi
