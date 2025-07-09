# 🔐 Configuration Google OAuth - Guide Complet

## 🎯 Objectif
Configurer l'authentification Google OAuth pour l'application PrestigeWash avec Supabase en mode production.

## 📋 Prérequis
- Projet Supabase configuré
- Compte Google Cloud Platform
- Variables d'environnement Supabase configurées

## 🛠️ Étapes de Configuration

### 1. Configuration Google Cloud Platform

#### 1.1 Créer un projet Google Cloud
1. Aller sur [Google Cloud Console](https://console.cloud.google.com)
2. Créer un nouveau projet ou sélectionner un existant
3. Nommer le projet : `prestigewash-auth`

#### 1.2 Activer l'API Google+
1. Dans la console Google Cloud, aller dans **APIs & Services** > **Library**
2. Rechercher "Google+ API" ou "Google Identity"
3. Cliquer sur **Google+ API** et l'activer
4. Rechercher "Google Identity Services API" et l'activer aussi

#### 1.3 Créer les identifiants OAuth 2.0
1. Aller dans **APIs & Services** > **Credentials**
2. Cliquer sur **Create Credentials** > **OAuth client ID**
3. Sélectionner **Web application**
4. Configurer :
   - **Name** : `PrestigeWash OAuth`
   - **Authorized JavaScript origins** :
     - `http://localhost:5173` (développement)
     - `https://votre-domaine.com` (production)
   - **Authorized redirect URIs** :
     - `https://xjustayvjwnixygifisp.supabase.co/auth/v1/callback`

5. Cliquer sur **Create**
6. Noter le **Client ID** et **Client Secret**

### 2. Configuration Supabase

#### 2.1 Configurer le provider Google
1. Dans Supabase Dashboard, aller dans **Authentication** > **Providers**
2. Trouver **Google** et cliquer sur **Configure**
3. Activer **Enable Google provider**
4. Remplir :
   - **Client ID** : coller le Client ID de Google Cloud
   - **Client Secret** : coller le Client Secret de Google Cloud
5. Cliquer sur **Save**

#### 2.2 Configurer les URLs de redirection
1. Dans **Authentication** > **Settings**
2. Configurer :
   - **Site URL** : `https://votre-domaine.com`
   - **Additional Redirect URLs** :
     - `http://localhost:5173/auth/callback`
     - `https://votre-domaine.com/auth/callback`

### 3. Mise à jour du Code

#### 3.1 Page de callback OAuth
Créer `/src/pages/AuthCallback.tsx` :

```tsx
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const { user, loading } = useSupabaseAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/')
      } else {
        navigate('/login')
      }
    }
  }, [user, loading, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Connexion en cours...</h2>
        <p className="text-gray-500 mt-2">Veuillez patienter</p>
      </div>
    </div>
  )
}

export default AuthCallback
```

#### 3.2 Mise à jour du routeur
Dans `src/App.tsx`, ajouter la route :

```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthCallback from './pages/AuthCallback'

function App() {
  return (
    <Router>
      <Routes>
        {/* Autres routes */}
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  )
}
```

### 4. Test de l'authentification

#### 4.1 Vérifications préliminaires
1. Vérifier que Supabase est configuré :
   ```bash
   # Dans la console du navigateur
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
   console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY)
   ```

2. Vérifier la connexion Supabase :
   - Ouvrir l'application en mode développement
   - Vérifier que l'indicateur affiche "🔒 Mode Production"

#### 4.2 Test du flux OAuth
1. Cliquer sur "Continuer avec Google"
2. Vérifier la redirection vers Google
3. Se connecter avec un compte Google
4. Vérifier la redirection vers `/auth/callback`
5. Vérifier la connexion dans l'application

### 5. Sécurité et Production

#### 5.1 Restrictions de domaine
Dans Google Cloud Console :
1. Aller dans **OAuth consent screen**
2. Ajouter votre domaine de production
3. Configurer les scopes nécessaires :
   - `email`
   - `profile`
   - `openid`

#### 5.2 Variables d'environnement Vercel
1. Dans Vercel Dashboard, aller dans **Settings** > **Environment Variables**
2. Ajouter :
   ```
   VITE_SUPABASE_URL=https://xjustayvjwnixygifisp.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 6. Débogage

#### 6.1 Erreurs courantes
- **"redirect_uri_mismatch"** : Vérifier les URLs de redirection
- **"invalid_client"** : Vérifier le Client ID et Secret
- **"access_denied"** : Vérifier les permissions OAuth

#### 6.2 Logs de débogage
```typescript
// Dans useSupabaseAuth.ts
const signInWithGoogle = async () => {
  console.log('🔍 Debug Google OAuth:', {
    url: window.location.origin,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    redirectTo: `${window.location.origin}/auth/callback`
  })
  
  // ... rest of the function
}
```

## 📊 État Actuel

✅ **Déjà configuré :**
- Hook `useSupabaseAuth` avec support Google OAuth
- Composant `ProductionAuth` avec bouton Google
- Gestion des erreurs et loading states
- Mode développement avec simulation

🔄 **À configurer :**
- Google Cloud Platform project
- Supabase Google provider
- Page de callback OAuth
- Variables d'environnement production

## 🚀 Prochaines Étapes

1. **Configurer Google Cloud Platform** (15 minutes)
2. **Configurer Supabase Provider** (5 minutes)
3. **Créer la page de callback** (10 minutes)
4. **Tester en local** (5 minutes)
5. **Déployer en production** (5 minutes)

## 💡 Conseils

- Toujours tester en mode développement d'abord
- Vérifier les domaines autorisés dans Google Cloud
- Surveiller les logs d'erreur dans Supabase
- Utiliser HTTPS en production pour OAuth

---

Une fois cette configuration terminée, votre application aura une authentification Google OAuth complète et sécurisée ! 🎉
