# 🔧 Fix Authentification Google - Guide de Dépannage

## 🚨 **Problème Identifié**
L'authentification Google ne fonctionne pas car les variables d'environnement Supabase utilisent des valeurs factices.

## 📊 **État Actuel**
```bash
VITE_SUPABASE_URL=https://dummy.supabase.co
VITE_SUPABASE_ANON_KEY=dummy-anon-key
```

## ✅ **Solution 1 : Configuration Supabase Réelle** (Recommandée)

### Étape 1: Créer un projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un compte/se connecter
3. Créer un nouveau projet
4. Noter l'URL du projet et la clé anonyme

### Étape 2: Configurer Google OAuth
1. Dans le dashboard Supabase > Authentication > Providers
2. Activer Google Provider
3. Configurer les credentials Google OAuth :
   - Client ID Google
   - Client Secret Google
   - Redirect URL: `http://localhost:5183/auth/callback`

### Étape 3: Mettre à jour .env
```bash
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_reelle
```

### Étape 4: Créer les tables dans Supabase
Exécuter le script SQL fourni dans `supabase/schema.sql`

## 🔄 **Solution 2 : Mode Développement** (Temporaire)

Si vous voulez tester rapidement sans configurer Supabase :

### Utiliser le sélecteur de mode d'authentification
1. Dans l'application, utiliser le commutateur en haut à droite
2. Sélectionner "Mode Développement"
3. Utiliser l'authentification simulée avec les utilisateurs prédéfinis

## 🛠️ **Solution 3 : Mock Google Auth pour Dev**

Nous pouvons aussi créer un mock de l'authentification Google pour le développement :

```typescript
// Dans useSupabaseAuth.ts
const signInWithGoogle = async () => {
  if (import.meta.env.DEV && supabaseUrl.includes('dummy')) {
    // Mode développement - simuler l'auth Google
    showSuccess('Mode développement', 'Authentification Google simulée');
    return { success: true, data: null };
  }
  
  // Code existant pour Supabase réel...
}
```

## 🔍 **Diagnostic Console**

Ouvrez les DevTools (F12) et regardez les erreurs dans :
- Console (onglet Console)
- Network (onglet Réseau)
- Application > Local Storage

Les erreurs typiques :
- `Invalid API key` → Variables d'environnement incorrectes
- `OAuth not configured` → Google OAuth pas configuré dans Supabase
- `CORS error` → URL de redirection incorrecte

## 📱 **Test de l'authentification**

1. **Mode Dev** : Utilisez le sélecteur en haut à droite
2. **Mode Supabase** : Configurez d'abord Supabase
3. **Vérification** : Regardez la console pour les erreurs

## 🎯 **Prochaines Étapes**

Quelle solution préférez-vous ?
1. **Configurer Supabase réel** (production-ready)
2. **Améliorer le mode dev** (développement rapide)
3. **Créer un mock Google** (test intermédiaire)
