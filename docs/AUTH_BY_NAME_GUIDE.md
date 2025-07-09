# Authentification par Nom - Auto Wash Club VIP

## Vue d'ensemble

L'application utilise maintenant un système d'authentification basé sur le **nom de la personne** (login) plutôt que sur l'email. Cette approche est plus intuitive pour les utilisateurs autorisés et simplifie le processus de connexion.

## Fonctionnement

### 1. Interface de connexion

- **Champ principal** : "Nom d'utilisateur" (remplace l'ancien champ "Email")
- **Placeholder** : "Votre nom (ex: Dorsaf, Najla, etc.)"
- **Détection automatique** : Le système détecte automatiquement si l'utilisateur est autorisé

### 2. Modes d'authentification

#### Mode Local (Utilisateurs autorisés)
- **Indicateur** : Badge vert "Utilisateur autorisé - Authentification locale"
- **Activation** : Automatique quand un nom autorisé est saisi
- **Fonctionnalités** :
  - Connexion par nom + mot de passe
  - Gestion des tentatives de connexion
  - Verrouillage automatique après échecs
  - Première connexion avec mot de passe temporaire

#### Mode Supabase (Inscription)
- **Indicateur** : Badge bleu "Mode inscription - Authentification Supabase"
- **Activation** : Automatique pour les noms non autorisés
- **Fonctionnalités** :
  - Inscription via Google OAuth
  - Inscription email/mot de passe classique

## Utilisateurs autorisés

### Membres du CODIR (Accès complet)
1. **Dorsaf** - CEO
2. **Najla** - DAF (Directeur Administratif et Financier)
3. **Karima** - DRH (Directeur Ressources Humaines)
4. **Ahmed** - DCOM (Directeur Commercial)
5. **Slim** - DIT (Directeur Informatique)
6. **Zohra** - Responsable Qualité
7. **Mounir** - Responsable Maintenance
8. **Fatma** - Responsable Sécurité
9. **Youssef** - Responsable Logistique
10. **Leila** - Responsable Finance
11. **Tarek** - Responsable Achat
12. **Nadia** - Responsable Vente
13. **Sami** - Responsable Production

### Visualisateurs
14. **Ines** - Visualisateur (lecture seule)

## Processus de première connexion

### 1. Connexion initiale
- Saisir le nom d'utilisateur (ex: "Dorsaf")
- Saisir le mot de passe temporaire : `[Nom]2025!`
- Exemple : `Dorsaf2025!`

### 2. Configuration du mot de passe
- Interface de configuration automatique
- Champs :
  - Mot de passe temporaire (pré-rempli)
  - Nouveau mot de passe
  - Confirmation du mot de passe
- Validation et sauvegarde

### 3. Connexions suivantes
- Utiliser le nom d'utilisateur + nouveau mot de passe
- Pas de configuration supplémentaire

## Sécurité

### Tentatives de connexion
- **Maximum** : 3 tentatives
- **Verrouillage** : 15 minutes après échec
- **Compteur** : Affiché dans les messages d'erreur

### Mots de passe temporaires
- **Format** : `[Nom]2025!`
- **Usage** : Uniquement pour la première connexion
- **Sécurité** : Remplacés obligatoirement au premier usage

## Messages d'erreur

### Authentification locale
- `"Nom requis"` - Champ nom vide
- `"Utilisateur non autorisé"` - Nom non dans la liste
- `"Mot de passe incorrect"` - Mot de passe erroné
- `"Compte temporairement verrouillé"` - Trop de tentatives
- `"Mot de passe temporaire invalide"` - Erreur première connexion

### Indicateurs visuels
- **Badge vert** : Utilisateur autorisé trouvé
- **Badge bleu** : Mode inscription Supabase
- **Messages colorés** : Erreurs en rouge, succès en vert

## Avantages

1. **Simplicité** : Les utilisateurs retiennent mieux leur nom que leur email
2. **Intuitivité** : Interface plus naturelle pour les équipes
3. **Sécurité** : Système de verrouillage et tentatives limitées
4. **Flexibilité** : Coexistence avec l'authentification Supabase
5. **Maintenance** : Gestion centralisée des utilisateurs autorisés

## Tests recommandés

1. **Connexion normale** : Nom + mot de passe
2. **Première connexion** : Mot de passe temporaire
3. **Tentatives multiples** : Vérifier le verrouillage
4. **Noms non autorisés** : Vérifier le mode Supabase
5. **Interface** : Vérifier les indicateurs visuels

## Dépannage

### Problèmes courants
- **"Utilisateur non autorisé"** : Vérifier l'orthographe du nom
- **"Compte verrouillé"** : Attendre 15 minutes
- **"Mot de passe temporaire invalide"** : Contacter l'administrateur

### Contact administrateur
Pour réinitialiser un mot de passe ou débloquer un compte, contacter l'administrateur système.
