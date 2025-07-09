#!/bin/bash

# Script de test pour l'authentification par nom
# Ce script teste le nouveau système d'authentification avec nom d'utilisateur

echo "🧪 Test de l'authentification par nom - Auto Wash Club VIP"
echo "==========================================================="

echo ""
echo "📋 Utilisateurs autorisés disponibles:"
echo "- Dorsaf (CEO)"
echo "- Najla (DAF)"
echo "- Karima (DRH)"
echo "- Ahmed (DCOM)"
echo "- Slim (DIT)"
echo "- Zohra (Responsable Qualité)"
echo "- Mounir (Responsable Maintenance)"
echo "- Fatma (Responsable Sécurité)"
echo "- Youssef (Responsable Logistique)"
echo "- Leila (Responsable Finance)"
echo "- Tarek (Responsable Achat)"
echo "- Nadia (Responsable Vente)"
echo "- Sami (Responsable Production)"
echo "- Ines (Visualisateur)"

echo ""
echo "🔐 Mode d'authentification:"
echo "- Connexion par nom d'utilisateur (pas par email)"
echo "- Première connexion : utiliser le mot de passe temporaire"
echo "- Mots de passe temporaires : [Nom]2025! (ex: Dorsaf2025!)"

echo ""
echo "🧪 Tests à effectuer:"
echo "1. Tester la connexion avec un nom autorisé (ex: Dorsaf)"
echo "2. Vérifier que le mode 'local' est activé automatiquement"
echo "3. Tester la première connexion avec mot de passe temporaire"
echo "4. Tester la connexion avec un nom non autorisé"
echo "5. Vérifier les messages d'erreur appropriés"

echo ""
echo "🚀 Lancement du serveur de développement..."
cd "$(dirname "$0")"
npm run dev
