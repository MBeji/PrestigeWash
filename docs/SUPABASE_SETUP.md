# 🚀 Guide d'Installation Supabase - Auto Wash Club VIP

## 📋 **Prérequis**

1. **Compte Supabase** : [Créer un compte gratuit](https://supabase.com)
2. **Node.js** installé sur votre machine
3. **Projet Auto Wash Club** cloné localement

## ⚙️ **Configuration Supabase**

### **1. Créer un nouveau projet Supabase**

1. Connectez-vous à [Supabase Dashboard](https://supabase.com/dashboard)
2. Cliquez sur "New Project"
3. Remplissez les informations :
   - **Name** : `auto-wash-club-vip`
   - **Database Password** : Générez un mot de passe sécurisé
   - **Region** : Choisissez Europe (Paris) pour de meilleures performances
4. Cliquez sur "Create new project"
5. Attendez que le projet soit initialisé (2-3 minutes)

### **2. Obtenir les clés API**

1. Dans votre projet Supabase, allez dans **Settings** > **API**
2. Copiez les informations suivantes :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (la clé publique anonyme)

### **3. Configurer les variables d'environnement**

1. Dans le projet, copiez `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```

2. Modifiez le fichier `.env` avec vos vraies valeurs :
   ```bash
   VITE_SUPABASE_URL=https://votre-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_ici
   ```

### **4. Initialiser la base de données**

1. Dans Supabase Dashboard, allez dans **SQL Editor**
2. Créez une nouvelle requête
3. Copiez-collez le contenu du fichier `supabase/schema.sql`
4. Exécutez la requête (bouton "Run")
5. Vérifiez que les tables sont créées dans **Table Editor**

## 🔐 **Configuration de l'authentification**

### **1. Activer Google OAuth (Optionnel)**

1. Dans Supabase Dashboard, allez dans **Authentication** > **Providers**
2. Activez **Google**
3. Configurez les clés OAuth Google :
   - Créez un projet sur [Google Cloud Console](https://console.cloud.google.com)
   - Activez l'API Google+ 
   - Créez des identifiants OAuth 2.0
   - Ajoutez l'URL de redirection : `https://votre-projet.supabase.co/auth/v1/callback`
   - Copiez Client ID et Client Secret dans Supabase

### **2. Configurer les URLs de redirection**

1. Dans **Authentication** > **URL Configuration**
2. Ajoutez vos URLs autorisées :
   - **Site URL** : `http://localhost:5173` (dev) + votre domaine de production
   - **Redirect URLs** : 
     - `http://localhost:5173/auth/callback`
     - `https://votre-domaine.com/auth/callback`

## 📊 **Vérification de l'installation**

### **1. Tester la connexion**

1. Démarrez l'application : `npm run dev`
2. Cliquez sur "Mode Production (Supabase)" en haut à droite
3. Testez la connexion avec un email/mot de passe

### **2. Vérifier les données**

1. Dans Supabase Dashboard > **Table Editor**
2. Vérifiez que la table `users` contient bien les 13 utilisateurs prédéfinis
3. Testez la création d'une réservation

### **3. Monitorer les requêtes**

1. Dans **API** > **Logs**
2. Vérifiez les requêtes en temps réel
3. Surveillez les erreurs éventuelles

## 🔄 **Migration des données existantes**

Si vous avez déjà des réservations en mode développement :

1. Exportez les données actuelles
2. Adaptez le format pour Supabase
3. Importez via **Table Editor** > **Insert** > **CSV**

## 🛡️ **Sécurité en production**

### **1. Row Level Security (RLS)**

✅ **Déjà configuré** dans `schema.sql` :
- Les utilisateurs ne peuvent modifier que leurs propres réservations
- Lecture libre pour tous les utilisateurs autorisés
- Validation des règles métier côté base de données

### **2. Variables d'environnement**

🔒 **En production**, utilisez des variables d'environnement sécurisées :
- Vercel : **Settings** > **Environment Variables**
- Netlify : **Site Settings** > **Environment Variables**
- Autres : Consultez la documentation de votre hébergeur

### **3. Monitoring**

Surveillez votre usage dans **Settings** > **Usage** :
- Requêtes API par mois
- Stockage utilisé
- Bande passante

## 🚨 **Dépannage**

### **Erreur : "Missing Supabase environment variables"**
- Vérifiez que `.env` contient les bonnes valeurs
- Redémarrez le serveur de développement

### **Erreur : "Invalid API key"**
- Vérifiez que la clé `anon public` est correcte
- Assurez-vous que le projet Supabase est bien actif

### **Erreur : "Row Level Security violation"**
- Vérifiez que les politiques RLS sont bien créées
- Réexécutez le script `schema.sql`

### **Les utilisateurs ne peuvent pas se connecter**
- Vérifiez que la table `users` contient bien les données
- Assurez-vous que les emails correspondent

## 📞 **Support**

En cas de problème :
1. Consultez la [documentation Supabase](https://supabase.com/docs)
2. Vérifiez les logs dans Supabase Dashboard
3. Contactez l'équipe de développement

---

## ✅ **Checklist de déploiement**

- [ ] Projet Supabase créé
- [ ] Variables d'environnement configurées
- [ ] Base de données initialisée avec `schema.sql`
- [ ] Authentification Google configurée (optionnel)
- [ ] URLs de redirection ajoutées
- [ ] Tests de connexion réussis
- [ ] Mode production activé dans l'application
- [ ] Surveillance activée

Une fois tous ces éléments validés, votre application Auto Wash Club VIP est prête pour la production ! 🚗✨
