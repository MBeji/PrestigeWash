# 🚀 Guide de Déploiement Vercel - PrestigeWash

## 📋 Prérequis

- [x] Projet pushé sur GitHub : https://github.com/MBeji/PrestigeWash
- [x] Compte Vercel (gratuit) : https://vercel.com
- [x] Compte Supabase : https://supabase.com
- [x] Configuration Supabase terminée

## 🚀 Déploiement automatique via Vercel Dashboard

### 1. Connecter le Repository GitHub

1. Aller sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Cliquer sur **"New Project"**
3. Sélectionner **"Import Git Repository"**
4. Chercher et sélectionner **"PrestigeWash"**
5. Cliquer sur **"Import"**

### 2. Configuration du Projet

Vercel détecte automatiquement :
- ✅ **Framework** : Vite
- ✅ **Build Command** : `npm run build`
- ✅ **Output Directory** : `dist`
- ✅ **Install Command** : `npm install`

### 3. Variables d'Environnement

Ajouter les variables suivantes dans Vercel :

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Comment les ajouter :**
1. Dans la section **"Environment Variables"** du projet
2. Cliquer sur **"Add New"**
3. Ajouter chaque variable :
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://your-project.supabase.co`
   - Environment: `Production`, `Preview`, `Development`

### 4. Déploiement

1. Cliquer sur **"Deploy"**
2. Attendre la fin du build (2-3 minutes)
3. L'application sera disponible sur `https://prestigewash.vercel.app`

## 🔧 Déploiement via CLI (Optionnel)

### 1. Installer Vercel CLI

```bash
npm install -g vercel
```

### 2. Se connecter à Vercel

```bash
vercel login
```

### 3. Déployer

```bash
# Déploiement de développement
vercel

# Déploiement de production
vercel --prod
```

## 📱 Configuration Post-Déploiement

### 1. Vérifier l'Application

- [ ] L'application se charge correctement
- [ ] L'authentification fonctionne
- [ ] Le calendrier s'affiche
- [ ] Les réservations peuvent être créées
- [ ] Le responsive design fonctionne

### 2. Configurer Supabase

Dans votre projet Supabase, ajouter l'URL Vercel aux **Site URL** :

1. Aller dans **Settings** > **Authentication**
2. Ajouter dans **Site URL** : `https://your-app.vercel.app`
3. Ajouter dans **Redirect URLs** : `https://your-app.vercel.app/auth/callback`

### 3. Domaine Personnalisé (Optionnel)

1. Dans Vercel Dashboard > **Settings** > **Domains**
2. Ajouter votre domaine personnalisé
3. Configurer les DNS selon les instructions Vercel

## 🔄 Déploiement Automatique

Vercel déploiera automatiquement à chaque push sur la branche `master` :

```bash
# Faire des modifications
git add .
git commit -m "Nouvelle fonctionnalité"
git push origin master

# Vercel déploiera automatiquement
```

## 🐛 Dépannage

### Erreur de Build

1. Vérifier les logs dans Vercel Dashboard
2. Vérifier que `npm run build` fonctionne localement
3. Vérifier les variables d'environnement

### Erreur d'Authentification

1. Vérifier les variables d'environnement Supabase
2. Vérifier la configuration des URLs dans Supabase
3. Vérifier les logs du navigateur

### Problème d'Affichage

1. Vérifier si le DataContext est correctement configuré
2. Passer en mode développement avec `DataContext-dev`
3. Vérifier les imports dans les composants

## 📊 Monitoring

Vercel fournit automatiquement :
- ✅ **Analytics** : Visiteurs, performance
- ✅ **Logs** : Erreurs, requêtes
- ✅ **Metrics** : Temps de chargement, Core Web Vitals
- ✅ **Alerts** : Notifications en cas d'erreur

## 🎯 URLs Importantes

- **Production** : https://your-app.vercel.app
- **Dashboard** : https://vercel.com/dashboard
- **Repository** : https://github.com/MBeji/PrestigeWash
- **Supabase** : https://supabase.com/dashboard

## 🏆 Prochaines Étapes

1. [ ] Tester l'application en production
2. [ ] Configurer un domaine personnalisé
3. [ ] Activer les analytics Vercel
4. [ ] Configurer les alertes de monitoring
5. [ ] Ajouter des tests automatisés
6. [ ] Optimiser les performances

---

**🎉 Félicitations ! PrestigeWash est maintenant déployé sur Vercel !**
