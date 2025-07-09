# Guide de déploiement Vercel avec Supabase

## Variables d'environnement Vercel

Pour déployer PrestigeWash avec Supabase sur Vercel, vous devez configurer les variables d'environnement suivantes :

### 1. Via le Dashboard Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet `PrestigeWash`
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez les variables suivantes :

```
VITE_SUPABASE_URL=https://xjustayvjwnixygifisp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqdXN0YXl2anduaXh5Z2lmaXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDI2NTYsImV4cCI6MjA2NzQ3ODY1Nn0.oaLK5wPwbOZktWMwCxZoYKL1ULnCZrK2xkcXLQe2PMs
```

### 2. Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Lier le projet
vercel link

# Ajouter les variables d'environnement
vercel env add VITE_SUPABASE_URL
# Entrer: https://xjustayvjwnixygifisp.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Entrer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqdXN0YXl2anduaXh5Z2lmaXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDI2NTYsImV4cCI6MjA2NzQ3ODY1Nn0.oaLK5wPwbOZktWMwCxZoYKL1ULnCZrK2xkcXLQe2PMs
```

### 3. Déploiement

```bash
# Déployer en production
vercel --prod
```

## Vérification du déploiement

L'application détectera automatiquement si Supabase est configuré :
- ✅ **Avec Supabase** : Mode production complet
- ⚠️ **Sans Supabase** : Mode développement avec données mockées

## Structure des fichiers

```
src/
├── lib/
│   └── supabase.ts          # Client Supabase avec auto-configuration
├── config/
│   └── app.ts               # Configuration environnement
├── components/
│   └── SupabaseStatus.tsx   # Affichage du statut de connexion
└── .env.local               # Variables locales (ne pas commiter)
```

## Commandes utiles

```bash
# Test local en mode production
npm run build
npx serve dist -p 3000

# Vérifier les variables d'environnement
vercel env ls

# Voir les logs de déploiement
vercel logs
```

## Sécurité

- ✅ La clé `VITE_SUPABASE_ANON_KEY` est sécurisée pour le client
- ✅ Les variables sont automatiquement chiffrées par Vercel
- ✅ RLS (Row Level Security) doit être activé sur Supabase

## Support

En cas de problème :
1. Vérifiez que les variables sont bien définies sur Vercel
2. Consultez les logs de déploiement
3. Testez en local avec `npm run build`
