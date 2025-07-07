# 🔧 Configuration Variables d'Environnement Vercel

## ⚠️ ERREUR CORRIGÉE

L'erreur `Environment Variable "VITE_SUPABASE_URL" references Secret "vite_supabase_url", which does not exist` a été corrigée.

**Problème :** Le fichier `vercel.json` utilisait une syntaxe incorrecte avec `@vite_supabase_url`.

**Solution :** Les variables d'environnement doivent être configurées dans le Dashboard Vercel, pas dans le fichier `vercel.json`.

## 🔧 Configuration Correcte

### 1. Variables à configurer dans Vercel Dashboard

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Où trouver ces valeurs dans Supabase

1. **Aller dans votre projet Supabase**
2. **Settings** → **API**
3. Copier :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

### 3. Ajouter dans Vercel Dashboard

1. **Aller dans votre projet Vercel**
2. **Settings** → **Environment Variables**
3. **Add New** pour chaque variable :

**Variable 1 :**
- Name: `VITE_SUPABASE_URL`
- Value: `https://abcdefghijklmnop.supabase.co`
- Environment: ✅ Production ✅ Preview ✅ Development

**Variable 2 :**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Environment: ✅ Production ✅ Preview ✅ Development

### 4. Redéployer

Après avoir ajouté les variables, redéployer :
1. **Deployments** → **...** → **Redeploy**
2. Ou faire un nouveau commit/push

## ✅ Vérification

L'application devrait maintenant :
- ✅ Se construire sans erreur
- ✅ Se connecter à Supabase
- ✅ Permettre l'authentification
- ✅ Afficher le calendrier avec données réelles

## 🚨 Mode Développement Local

Si vous n'avez pas encore configuré Supabase, l'application fonctionne en mode développement avec des données mockées via `DataContext-dev`.

## 🆘 Dépannage

**Si l'erreur persiste :**
1. Vérifier que `vercel.json` ne contient pas de section `env`
2. Vérifier que les variables sont bien dans le Dashboard
3. Forcer un redéploiement
4. Vérifier les logs de build dans Vercel

**Contact :** En cas de problème, vérifier les logs dans Vercel Dashboard → Deployments → Build Logs.
