# Auto Wash Club Calendar 🚗

Une application web moderne de gestion de réservations pour un club de lavage automobile, inspirée du projet [MBeji/auto-wash-club-calendrier](https://github.com/MBeji/auto-wash-club-calendrier/).

## 🚀 Fonctionnalités

- **📅 Calendrier de réservations** : 3 créneaux disponibles chaque vendredi
- **🔐 Authentification sécurisée** : Connexion via Google OAuth
- **👥 Gestion des rôles** : Membres, Directeurs, Administrateurs
- **⏰ Contraintes horaires** : Règle des 2 semaines entre réservations
- **💻 Interface moderne** : Design responsive avec Tailwind CSS
- **⚡ Performance optimisée** : React 18 + Vite + TypeScript

## 🛠️ Technologies

- **Frontend** : React 18, TypeScript, Vite
- **Styling** : Tailwind CSS, shadcn/ui
- **Backend** : Supabase (PostgreSQL + Auth)
- **Icons** : Lucide React
- **Outils** : date-fns, clsx, tailwind-merge

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Supabase

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd Carcalendrier
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration Supabase**
   ```bash
   cp .env.example .env
   ```
   Remplir les variables d'environnement dans `.env` :
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Démarrer l'application**
   ```bash
   npm run dev
   ```

## 📊 Structure de base de données

### Tables Supabase
- **users** : Gestion des utilisateurs et rôles
- **bookings** : Réservations (user_id, date, créneau)
- **time_constraints** : Contraintes horaires

## 🎨 Interface utilisateur

L'application propose 3 onglets principaux :

1. **📅 Calendrier** : Visualisation et création de réservations
2. **👥 Directeurs** : Gestion des permissions (rôle directeur+)
3. **⚙️ Administration** : Configuration système (rôle admin)

## 🔧 Scripts disponibles

- `npm run dev` : Démarrage en mode développement
- `npm run build` : Build de production
- `npm run preview` : Aperçu du build
- `npm run lint` : Vérification ESLint

## 📝 Licence

Ce projet est inspiré du travail de [MBeji](https://github.com/MBeji) sur le repository auto-wash-club-calendrier.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou proposer une pull request.
