<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Auto Wash Club Calendar - Instructions pour Copilot

## Contexte du projet
Ce projet est une application de **calendrier de réservations pour un club de lavage automobile** qui permet aux membres de réserver des créneaux de lavage les vendredis.

## Technologies utilisées
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Icons**: Lucide React
- **Utilities**: date-fns, clsx, tailwind-merge

## Fonctionnalités principales
1. **Authentification** via Google OAuth avec Supabase
2. **Calendrier de réservations** avec 3 créneaux par vendredi :
   - 08:00 - 10:00
   - 10:00 - 12:00  
   - 14:00 - 16:00
3. **Gestion des rôles** : Membres, Directeurs, Administrateurs
4. **Règle des 2 semaines** : espacement minimum entre réservations
5. **Interface d'administration** pour la gestion

## Structure des composants
- Utiliser les composants shadcn/ui pour l'interface
- Préférer la composition de composants réutilisables
- Utiliser Tailwind CSS pour le styling
- Suivre les patterns React modernes (hooks, functional components)

## Base de données Supabase
Tables principales :
- `users` : informations utilisateur et rôles
- `bookings` : réservations avec user_id, date, créneau
- `time_constraints` : contraintes horaires optionnelles

## Style de code
- TypeScript strict
- Noms en français pour l'interface utilisateur
- Composants fonctionnels avec hooks
- Gestion d'état locale avec useState/useEffect
- Gestion d'erreurs appropriée
