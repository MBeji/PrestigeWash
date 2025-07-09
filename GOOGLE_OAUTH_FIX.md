# 🔧 Configuration Google OAuth dans Supabase - Guide Rapide

## 🚨 Problème actuel
```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

Cette erreur indique que le **provider Google n'est pas activé** dans votre dashboard Supabase.

## ⚡ Solution rapide

### 1. Accéder au dashboard Supabase
```
https://supabase.com/dashboard
```

### 2. Sélectionner votre projet
- Projet actuel : `xjustayvjwnixygifisp.supabase.co`

### 3. Activer Google OAuth
1. Aller dans **Authentication** → **Providers**
2. Trouver **Google** dans la liste
3. Cliquer sur **Enable** ou **Configure**

### 4. Configuration minimale (pour tester)
```
Client ID: (temporaire pour test)
Client Secret: (temporaire pour test)
```

⚠️ **Note** : Vous pouvez activer temporairement avec des valeurs factices pour tester l'activation.

## 🔄 Alternative : Mode développement

Si vous préférez tester sans configurer Google OAuth tout de suite, vous pouvez forcer le mode développement :

### Modifier temporairement .env.local
```bash
# Forcer le mode développement
VITE_SUPABASE_URL=https://dummy.supabase.co
VITE_SUPABASE_ANON_KEY=dummy-key
```

### Redémarrer l'application
```bash
# Arrêter le serveur (Ctrl+C)
# Relancer
npm run dev
```

## 📋 Configuration Google OAuth complète

### Étape 1 : Google Cloud Console
1. Aller sur https://console.cloud.google.com
2. Créer un nouveau projet ou sélectionner existant
3. Activer l'API **Google+ API**
4. Créer des identifiants **OAuth 2.0**

### Étape 2 : Configurer les URLs
```
Authorized JavaScript origins:
- http://localhost:5182
- https://votre-domaine.com

Authorized redirect URIs:
- https://xjustayvjwnixygifisp.supabase.co/auth/v1/callback
```

### Étape 3 : Supabase Dashboard
1. **Authentication** → **Providers** → **Google**
2. Coller **Client ID** et **Client Secret**
3. **Save**

## 🧪 Test après configuration

1. **Redémarrer l'application**
2. **Tester Google OAuth**
3. **Vérifier les logs** dans Supabase Dashboard

## 💡 Choix recommandé

### Pour tester immédiatement
→ **Forcer le mode développement** (solution temporaire)

### Pour une solution complète
→ **Configurer Google OAuth** dans Supabase (solution permanente)

---

**La configuration Google OAuth prend 5-10 minutes. Le mode développement fonctionne immédiatement !**
