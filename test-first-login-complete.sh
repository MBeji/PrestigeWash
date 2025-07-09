#!/bin/bash

# Script de test pour la première connexion avec création de compte
# Tests du processus complet de première connexion

echo "🔐 Test de première connexion - Création de compte utilisateur"
echo "=============================================================="

echo ""
echo "📋 Processus à tester:"
echo "1. Connexion avec nom d'utilisateur + mot de passe temporaire"
echo "2. Détection automatique de la première connexion"
echo "3. Interface de configuration du mot de passe"
echo "4. Création et activation du compte utilisateur"
echo "5. Connexion automatique après configuration"

echo ""
echo "👥 Utilisateurs de test disponibles:"
echo "- Dorsaf (CEO) → Mot de passe temporaire: Dorsaf2025!"
echo "- Najla (DAF) → Mot de passe temporaire: Najla2025!"
echo "- Ahmed (DCOM) → Mot de passe temporaire: Ahmed2025!"
echo "- Ines (Visualisateur) → Mot de passe temporaire: Ines2025!"

echo ""
echo "🧪 Tests à effectuer:"
echo ""
echo "Test 1: Première connexion normale"
echo "- Saisir 'Dorsaf' dans le champ nom"
echo "- Vérifier que le badge vert 'Utilisateur autorisé' apparaît"
echo "- Saisir le mot de passe temporaire: Dorsaf2025!"
echo "- Cliquer sur 'Se connecter'"
echo "- Vérifier l'affichage de l'écran de première connexion"

echo ""
echo "Test 2: Configuration du mot de passe"
echo "- Vérifier que le titre affiche 'Première Connexion'"
echo "- Vérifier le message de bienvenue avec le nom"
echo "- Vérifier que le mot de passe temporaire est pré-rempli"
echo "- Saisir un nouveau mot de passe (minimum 6 caractères)"
echo "- Confirmer le nouveau mot de passe"
echo "- Cliquer sur 'Définir mon mot de passe'"

echo ""
echo "Test 3: Création du compte et connexion"
echo "- Vérifier le message de succès"
echo "- Vérifier la connexion automatique"
echo "- Vérifier l'accès à l'application"
echo "- Vérifier les informations utilisateur affichées"

echo ""
echo "Test 4: Connexion suivante"
echo "- Se déconnecter"
echo "- Se reconnecter avec le nom + nouveau mot de passe"
echo "- Vérifier que la connexion se fait directement (pas de première connexion)"

echo ""
echo "Test 5: Gestion d'erreurs"
echo "- Tester avec un mot de passe temporaire incorrect"
echo "- Tester avec un nouveau mot de passe trop court"
echo "- Tester avec des mots de passe qui ne correspondent pas"
echo "- Vérifier les messages d'erreur appropriés"

echo ""
echo "🎯 Résultats attendus:"
echo "✅ Détection automatique de la première connexion"
echo "✅ Interface dédiée avec instructions claires"
echo "✅ Validation des mots de passe et gestion d'erreurs"
echo "✅ Création du compte utilisateur local"
echo "✅ Connexion automatique après configuration"
echo "✅ Authentification normale pour les connexions suivantes"

echo ""
echo "🚀 Lancement de l'application..."
echo "URL: http://localhost:5187"
echo ""
echo "Commencez les tests avec l'utilisateur 'Dorsaf' !"

# Optionnel: ouvrir automatiquement le navigateur
# start http://localhost:5187  # Windows
# open http://localhost:5187   # macOS
# xdg-open http://localhost:5187  # Linux
