# 🧪 Guide de Test - Authentification Google OAuth

## 🎯 Objectif
Tester l'authentification Google OAuth dans l'application PrestigeWash, en mode développement et production.

## 📋 Prérequis
- Application en cours d'exécution (`npm run dev`)
- Variables d'environnement Supabase configurées
- Composants OAuth intégrés

## 🧪 Test 1 : Mode Développement (Simulation)

### Configuration actuelle
```bash
# Dans .env.local
VITE_SUPABASE_URL=https://xjustayvjwnixygifisp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Procédure de test
1. **Lancer l'application**
   ```bash
   npm run dev
   ```

2. **Accéder à l'interface**
   - URL: http://localhost:5173
   - Vérifier l'affichage du sélecteur d'authentification

3. **Sélectionner le mode Supabase**
   - Cliquer sur "Mode Prod" (bouton en haut à droite)
   - Vérifier l'affichage du formulaire Supabase

4. **Tester Google OAuth**
   - Cliquer sur "Continuer avec Google"
   - **Résultat attendu** : Redirection vers Google OAuth réel

### Vérifications
- [ ] Interface d'authentification affichée
- [ ] Bouton Google OAuth présent
- [ ] Redirection vers Google fonctionne
- [ ] Callback OAuth géré correctement

## 🧪 Test 2 : Mode Production (Supabase Réel)

### Configuration requise
1. **Projet Supabase configuré**
   - URL et clé API réelles
   - Tables `users`, `bookings` créées
   - Politiques RLS activées

2. **Google OAuth configuré**
   - Projet Google Cloud Platform
   - Identifiants OAuth 2.0 créés
   - URLs de redirection configurées

### Procédure de test
1. **Configurer les variables d'environnement**
   ```bash
   # Variables production dans .env.local
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_cle_reelle
   ```

2. **Configurer Google OAuth dans Supabase**
   - Dashboard Supabase > Authentication > Providers
   - Activer Google Provider
   - Ajouter Client ID et Client Secret

3. **Configurer les URLs de redirection**
   - Site URL: `http://localhost:5173`
   - Redirect URLs: `http://localhost:5173/auth/callback`

4. **Tester l'authentification**
   - Cliquer sur "Continuer avec Google"
   - Se connecter avec un compte Google
   - Vérifier la redirection vers `/auth/callback`
   - Vérifier la connexion dans l'application

### Vérifications
- [ ] Redirection vers Google OAuth
- [ ] Connexion Google réussie
- [ ] Callback OAuth traité
- [ ] Utilisateur connecté dans l'application
- [ ] Données utilisateur récupérées de Supabase

## 🐛 Débogage

### Problèmes courants

#### 1. "redirect_uri_mismatch"
**Cause** : URL de redirection non autorisée
**Solution** :
1. Vérifier Google Cloud Console > Credentials
2. Ajouter `http://localhost:5173/auth/callback`
3. Vérifier Supabase > Authentication > Settings

#### 2. "invalid_client"
**Cause** : Client ID ou Secret incorrects
**Solution** :
1. Vérifier les identifiants Google Cloud
2. Recopier Client ID et Secret dans Supabase
3. Sauvegarder la configuration

#### 3. "OAuth provider not configured"
**Cause** : Google OAuth non activé dans Supabase
**Solution** :
1. Supabase Dashboard > Authentication > Providers
2. Activer Google Provider
3. Sauvegarder la configuration

### Logs de débogage

#### Console navigateur
```javascript
// Vérifier les variables d'environnement
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY)

// Vérifier les paramètres OAuth
console.log('OAuth params:', new URLSearchParams(window.location.search))
```

#### Logs Supabase
1. Supabase Dashboard > Logs
2. Filtrer par "auth"
3. Surveiller les tentatives de connexion

## 📊 Résultats attendus

### Mode Développement
- ✅ Interface utilisateur fonctionnelle
- ✅ Bouton Google OAuth présent
- ✅ Redirection vers Google OAuth
- ⚠️ Authentification réelle (pas de simulation)

### Mode Production
- ✅ Connexion Google complète
- ✅ Utilisateur créé/récupéré de Supabase
- ✅ Session persistante
- ✅ Données synchronisées

## 🔄 Prochaines étapes

1. **Valider le flux complet**
   - Connexion Google → Callback → Application
   - Persistance de la session
   - Déconnexion

2. **Tester en production**
   - Déployer sur Vercel
   - Configurer les URLs de production
   - Tester avec utilisateurs réels

3. **Optimiser l'expérience**
   - Améliorer les messages d'erreur
   - Ajouter des indicateurs de chargement
   - Gérer les cas d'erreur

## 💡 Conseils

- **Toujours tester en mode développement d'abord**
- **Vérifier les logs en temps réel**
- **Utiliser les outils de développement du navigateur**
- **Documenter les problèmes rencontrés**

---

Une fois ces tests réussis, votre authentification Google OAuth sera pleinement fonctionnelle ! 🎉
