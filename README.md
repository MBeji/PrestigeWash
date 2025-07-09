# PrestigeWash - Calendrier de Réservations VIP

## 🚗 Auto Wash Club VIP - Calendrier de Réservations

Application web moderne pour la gestion des créneaux de lavage automobile réservée aux membres du CODIR et viewers autorisés.

### ✨ Fonctionnalités principales

- **🔐 Authentification sécurisée** avec Supabase + Google OAuth
- **📅 Calendrier intelligent** avec gestion des créneaux (vendredis uniquement)
- **⏰ 3 créneaux par jour** : 08:00-10:00, 10:00-12:00, 14:00-16:00
- **📱 Design responsive** - Optimisé mobile et desktop
- **👥 Gestion des rôles** : Membres, Directeurs, Administrateurs, Viewers
- **⚡ Temps réel** avec synchronisation automatique
- **🚫 Règle des 2 semaines** - Espacement minimum entre réservations
- **📊 Interface d'administration** pour la gestion avancée

### 🛠️ Technologies utilisées

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS + shadcn/ui components
- **Backend** : Supabase (PostgreSQL + Authentication)
- **Icons** : Lucide React
- **Utilities** : date-fns, clsx, tailwind-merge
- **Deploy** : Vercel (optimisé)

### 🚀 Déploiement rapide sur Vercel

#### 1. Cloner le projet
```bash
git clone https://github.com/MBeji/PrestigeWash.git
cd PrestigeWash
npm install
```

#### 2. Configuration Supabase
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables Supabase
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

#### 3. Déployer sur Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Ou via l'interface Vercel
# 1. Connecter le repo GitHub
# 2. Configurer les variables d'environnement
# 3. Déployer automatiquement
```

#### 4. Variables d'environnement Vercel
Dans l'interface Vercel, ajouter :
- `VITE_SUPABASE_URL` : URL de votre projet Supabase
- `VITE_SUPABASE_ANON_KEY` : Clé anonyme de votre projet Supabase

### 🏃‍♂️ Développement local

```bash
# Installer les dépendances
npm install

# Mode développement (avec données mockées)
npm run dev

# Mode production
npm run build
npm run preview
```

### 📱 Fonctionnalités responsive

- **Mobile** : Interface tactile optimisée
- **Tablet** : Vue hybride adaptée
- **Desktop** : Interface complète avec tous les contrôles

### 🔧 Configuration avancée

#### Mode développement sans Supabase
Le projet inclut un `DataContext-dev` qui permet de travailler avec des données simulées :

```typescript
// Dans src/App.tsx, remplacer :
import { DataProvider } from './contexts/DataContext';
// Par :
import { DataProvider } from './contexts/DataContext-dev';
```

#### Structure du projet
```
src/
├── components/          # Composants React
│   ├── Auth/           # Authentification
│   ├── Calendar/       # Calendrier (responsive)
│   └── ui/             # Composants UI réutilisables
├── contexts/           # Contextes React
├── hooks/              # Hooks personnalisés
├── lib/                # Utilitaires et config
└── styles/             # Styles globaux
```

### 🎯 Utilisateurs cibles

- **Membres CODIR** : Accès complet aux réservations
- **Viewers** : Consultation uniquement
- **Administrateurs** : Gestion complète du système

### 🔒 Sécurité

- Authentification Google OAuth via Supabase
- Validation des rôles côté serveur
- Protection des routes sensibles
- Gestion sécurisée des sessions

### 📊 Monitoring et Analytics

- Suivi des réservations en temps réel
- Logs d'activité utilisateur
- Métriques de performance
- Alertes automatiques

### 🆘 Support

Pour toute question ou problème :
1. Vérifier la documentation dans `/docs`
2. Consulter les logs Vercel
3. Vérifier la configuration Supabase
4. Contacter l'équipe de développement

### 📝 Licence

Projet privé - Réservé à l'usage interne du CODIR.

---

**Développé avec ❤️ pour l'Auto Wash Club VIP**

### 🔐 Authentification
- **Dual Mode** : Développement (simulé) + Production (Supabase)
- **Google OAuth** : Connexion rapide et sécurisée
- **Gestion des rôles** : CEO, Director, Viewer
- **Sessions persistantes** avec JWT

### 📅 Système de Réservation
- **Créneaux vendredis** : 08:00-10:00, 10:00-12:00, 14:00-16:00
- **Règle des 3 semaines** : Espacement minimum entre réservations
- **Temps réel** : Synchronisation instantanée entre utilisateurs
- **Annulation** : Possibilité d'annuler les réservations futures

### 🎨 Interface Utilisateur
- **Design VIP** : Interface moderne et élégante
- **Responsive** : Optimisé pour desktop et mobile
- **Notifications toast** : Feedback visuel pour toutes les actions
- **États de chargement** : Spinners et skeletons pendant les opérations
- **Confirmations élégantes** : Dialogs modernes pour les actions critiques

### 🔄 Synchronisation Temps Réel
- **Live updates** : Voir les réservations des autres en temps réel
- **Notifications** : Alertes pour les changements de planning
- **Cohérence** : État synchronisé entre tous les clients

## 🛠️ Technologies

### Frontend
- **React 18** + **TypeScript** : Framework moderne et typé
- **Vite** : Build tool rapide et optimisé
- **Tailwind CSS** : Styling utility-first
- **shadcn/ui** : Composants UI modernes
- **date-fns** : Manipulation des dates
- **Lucide React** : Icônes modernes

### Backend & Base de Données
- **Supabase** : Backend-as-a-Service
- **PostgreSQL** : Base de données relationnelle
- **Row Level Security** : Sécurité au niveau des données
- **Real-time subscriptions** : Mises à jour en temps réel

### Architecture
- **Hooks personnalisés** : useBookings, useUsers, useAuth
- **Context API** : Gestion d'état global
- **TypeScript strict** : Sécurité des types
- **Component-based** : Architecture modulaire

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase (optionnel pour mode dev)

### 1. Cloner le repository
```bash
git clone https://github.com/VOTRE_USERNAME/auto-wash-club-vip.git
cd auto-wash-club-vip
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Mode développement (par défaut)
VITE_SUPABASE_URL=https://dummy.supabase.co
VITE_SUPABASE_ANON_KEY=dummy-anon-key
```

### 4. Lancer l'application
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🔧 Configuration Supabase (Production)

Pour utiliser une vraie base de données Supabase :

### 1. Créer un projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et la clé API

### 2. Configurer la base de données
```sql
-- Exécuter le script dans l'éditeur SQL de Supabase
-- Fichier: supabase/schema.sql
```

### 3. Mettre à jour .env
```bash
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
```

### 4. Configurer Google OAuth
1. Dashboard Supabase > Authentication > Providers
2. Activer Google Provider
3. Ajouter vos credentials Google OAuth

## 📖 Documentation

- [**Guide des Améliorations**](docs/AMELIORATIONS.md) - Roadmap et fonctionnalités
- [**Migration Supabase**](docs/MIGRATION_SUPABASE_COMPLETE.md) - Détails techniques
- [**Setup Supabase**](docs/SUPABASE_SETUP.md) - Guide d'installation
- [**Fix Auth Google**](docs/FIX_GOOGLE_AUTH.md) - Résolution de problèmes

## 🎮 Utilisation

### Mode Développement
1. Cliquer sur le sélecteur de mode (coin supérieur droit)
2. Choisir "Mode Développement"  
3. Utiliser l'authentification simulée
4. Tester toutes les fonctionnalités

### Mode Production
1. Configurer Supabase (voir guide)
2. Choisir "Mode Supabase"
3. Se connecter avec Google OAuth
4. Utiliser l'application avec vraies données

### Réserver un Créneau
1. Naviguer dans le calendrier
2. Cliquer sur un vendredi futur
3. Choisir un créneau disponible
4. Confirmer la réservation

### Annuler une Réservation
1. Aller dans "Mes réservations futures"
2. Cliquer sur "Annuler" 
3. Confirmer l'annulation

## 🏗️ Structure du Projet

```
src/
├── components/           # Composants React
│   ├── Auth/            # Authentification
│   ├── Calendar/        # Calendrier principal
│   └── ui/              # Composants UI réutilisables
├── contexts/            # Contexts React
├── hooks/               # Hooks personnalisés
├── lib/                 # Configuration et utilitaires
└── data/                # Données et types
docs/                    # Documentation
supabase/               # Schema et configuration DB
```

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm run build
npx vercel
```

### Netlify
```bash
npm run build
# Drag & drop du dossier dist/
```

### Variables d'environnement
N'oubliez pas de configurer :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🤝 Contribution

Ce projet est destiné à un usage interne pour le CODIR. Pour des suggestions :

1. Créer une issue
2. Proposer des améliorations
3. Soumettre une pull request

## 📄 License

Propriété du CODIR - Usage interne uniquement

## 🎯 Roadmap

- [x] ✅ Migration Supabase complète
- [x] ✅ Authentification Google OAuth
- [x] ✅ Interface VIP moderne
- [x] ✅ Système de notifications
- [ ] 📱 Responsive design optimisé
- [ ] 👑 Dashboard administrateur
- [ ] 🔔 Notifications push
- [ ] 📊 Statistiques d'utilisation

---

**Made with ❤️ for CODIR - Auto Wash Club VIP** 🚗✨
# Build fix deployed
