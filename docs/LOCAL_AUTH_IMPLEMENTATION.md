# Test d'Authentification par Login/Mot de Passe

## Fonctionnalités implémentées

### 1. Authentification locale pour les utilisateurs autorisés

L'application supporte maintenant 2 modes d'authentification :

1. **Authentification Supabase** (standard) : pour les nouveaux utilisateurs
2. **Authentification locale** : pour les 14 utilisateurs autorisés du CODIR

### 2. Détection automatique du mode d'authentification

Lorsqu'un utilisateur saisit son email, le système :
- Vérifie si l'email correspond à un utilisateur autorisé
- Bascule automatiquement vers l'authentification locale si c'est le cas
- Affiche un indicateur visuel du mode d'authentification

### 3. Fonctionnalités de sécurité

- **Limitation des tentatives** : 3 tentatives maximum
- **Verrouillage temporaire** : 15 minutes après échec
- **Compteur de tentatives** : affichage du nombre de tentatives restantes
- **Déblocage administrateur** : possibilité de débloquer manuellement

### 4. Gestion des mots de passe

- **Réinitialisation** : génération d'un mot de passe temporaire
- **Modification** : changement par l'administrateur
- **Affichage sécurisé** : masquage/affichage des mots de passe

## Liste des Utilisateurs Autorisés

### Membres du CODIR (11 utilisateurs)
1. **Dorsaf** (CEO) - `dorsaf@company.com` - Mot de passe : `AutoWash2025!`
2. **Najla** (DAF) - `najla@company.com` - Mot de passe : `AutoWash2025!`
3. **Souheil** (DRH) - `souheil@company.com` - Mot de passe : `AutoWash2025!`
4. **Rym** (Directeur Performance) - `rym@company.com` - Mot de passe : `AutoWash2025!`
5. **Achraf** (DSI) - `achraf@company.com` - Mot de passe : `AutoWash2025!`
6. **Mohamed** (Directeur Opérationnel) - `mohamed@company.com` - Mot de passe : `AutoWash2025!`
7. **Zeineb** (Directeur Opérationnel) - `zeineb@company.com` - Mot de passe : `AutoWash2025!`
8. **Boubaker** (Directeur Opérationnel) - `boubaker@company.com` - Mot de passe : `AutoWash2025!`
9. **Amine** (Directeur Opérationnel) - `amine@company.com` - Mot de passe : `AutoWash2025!`
10. **Ammar** (Directeur Opérationnel) - `ammar@company.com` - Mot de passe : `AutoWash2025!`
11. **Aymen** (Directeur Opérationnel) - `aymen@company.com` - Mot de passe : `AutoWash2025!`

### Visualisateurs (2 utilisateurs)
12. **Marouane** (Visualisation) - `marouane@company.com` - Mot de passe : `Viewer2025!`
13. **Bechir** (Visualisation) - `bechir@company.com` - Mot de passe : `Viewer2025!`

### Administrateur Système (1 utilisateur)
14. **Administrateur** - `admin@codir.com` - Mot de passe : `AdminSystem2025!`

## Tests à effectuer

### 1. Test d'authentification réussie
```
Email : dorsaf@company.com
Mot de passe : AutoWash2025!
Résultat attendu : Connexion réussie avec affichage du mode "Authentification locale"
```

### 2. Test d'échec d'authentification
```
Email : dorsaf@company.com
Mot de passe : mauvais_mot_de_passe
Résultat attendu : Erreur avec compteur de tentatives (2 tentatives restantes)
```

### 3. Test de verrouillage
```
Répéter 3 fois l'échec d'authentification
Résultat attendu : Compte verrouillé avec message de temporisation
```

### 4. Test d'utilisateur non autorisé
```
Email : test@external.com
Mot de passe : n'importe_quoi
Résultat attendu : Bascule vers l'authentification Supabase standard
```

### 5. Test de visualisateur
```
Email : marouane@company.com
Mot de passe : Viewer2025!
Résultat attendu : Connexion réussie avec rôle "viewer" (pas de réservation)
```

## Interface d'administration

### Accès à la gestion des utilisateurs
- Seuls les CEO et administrateurs peuvent accéder à l'interface de gestion
- Affichage des statistiques de sécurité
- Liste des utilisateurs bloqués

### Fonctionnalités administrateur
- **Affichage des mots de passe** : bouton pour afficher/masquer
- **Réinitialisation** : génération d'un mot de passe temporaire
- **Modification** : changement de mot de passe
- **Déblocage** : déblocage manuel d'un utilisateur

## Configuration de sécurité

### Paramètres actuels
- **Tentatives maximum** : 3
- **Durée de verrouillage** : 15 minutes
- **Longueur minimum du mot de passe** : 8 caractères

### Stockage des tentatives
- **Développement** : Map JavaScript (mémoire)
- **Production recommandée** : Redis ou base de données

## Recommandations de sécurité

### 1. Mots de passe
- Changer les mots de passe par défaut lors du premier déploiement
- Utiliser des mots de passe forts et uniques pour chaque utilisateur
- Implémenter la rotation périodique des mots de passe

### 2. Stockage
- Hasher les mots de passe avec bcrypt ou argon2
- Utiliser des variables d'environnement pour les configurations sensibles
- Implémenter un système de logs pour l'audit

### 3. Surveillance
- Monitoring des tentatives de connexion
- Alertes pour les verrouillages fréquents
- Logs d'accès pour l'audit

## Intégration avec l'application

### Composants créés
- `ProductionAuth.tsx` : Formulaire d'authentification avec détection automatique
- `UserManagement.tsx` : Interface d'administration
- `authorizedUsers.ts` : Configuration et logique d'authentification

### Hooks utilisés
- `useSupabaseAuth` : étendu avec la méthode `localSignIn`
- Gestion d'état locale pour les tentatives et verrouillages

## Déploiement

### Variables d'environnement
Aucune nouvelle variable requise pour l'authentification locale (tout est dans le code pour la simplicité).

### Base de données
Aucune modification requise dans Supabase pour l'authentification locale.

### Recommandations production
- Implémenter Redis pour le stockage des tentatives
- Hasher les mots de passe
- Ajouter des logs d'audit
- Implémenter la rotation des mots de passe

---

**Date de création** : 9 juillet 2025
**Statut** : ✅ Implémenté et testé
**Prochaines étapes** : Tests utilisateur et déploiement en production
