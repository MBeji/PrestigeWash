# 🔧 Guide Configuration Supabase - PrestigeWash

## 🎯 Objectif
Passer du mode développement (données mockées) au mode production (Supabase) en configurant les variables d'environnement dans Vercel.

## 📋 Prérequis

### 1. Créer un projet Supabase
1. Aller sur [Supabase](https://supabase.com)
2. Créer un nouveau projet
3. Attendre l'initialisation (2-3 minutes)

### 2. Récupérer les informations de connexion
1. Dans votre projet Supabase : **Settings** → **API**
2. Noter :
   - **Project URL** : `https://abcdefghijklmnop.supabase.co`
   - **anon public key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🗄️ Configuration de la base de données

### 1. Créer les tables
Dans Supabase SQL Editor, exécuter :

```sql
-- Table users
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(100),
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'director', 'admin', 'viewer')),
  can_book BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table bookings
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slot VARCHAR(20) NOT NULL CHECK (time_slot IN ('08:00-10:00', '10:00-12:00', '14:00-16:00')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date, time_slot)
);

-- Index pour performance
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);

-- Politique de sécurité (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Politiques d'accès
CREATE POLICY "Users can read all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can read all bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete their own bookings" ON bookings FOR DELETE USING (auth.uid()::text = user_id::text);
```

### 2. Insérer des utilisateurs de test
```sql
INSERT INTO users (id, name, email, title, role, can_book) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Jean Dupont', 'jean.dupont@example.com', 'Directeur Général', 'director', true),
('550e8400-e29b-41d4-a716-446655440002', 'Marie Martin', 'marie.martin@example.com', 'Directrice Marketing', 'director', true),
('550e8400-e29b-41d4-a716-446655440003', 'Pierre Dubois', 'pierre.dubois@example.com', 'Viewer', 'viewer', false),
('550e8400-e29b-41d4-a716-446655440004', 'Sophie Laurent', 'sophie.laurent@example.com', 'Administrateur', 'admin', true);
```

## 🔑 Configuration authentification

### 1. Activer Google OAuth (optionnel)
1. Dans Supabase : **Authentication** → **Providers**
2. Activer **Google**
3. Configurer avec vos clés Google OAuth

### 2. Configurer les URLs
1. **Site URL** : `https://prestige-wash-letz.vercel.app`
2. **Redirect URLs** : `https://prestige-wash-letz.vercel.app/auth/callback`

## ⚙️ Configuration Vercel

### 1. Ajouter les variables d'environnement
1. Aller dans **Vercel Dashboard** → Votre projet → **Settings** → **Environment Variables**
2. Ajouter :

**Variable 1 :**
- **Name** : `VITE_SUPABASE_URL`
- **Value** : `https://votre-project-id.supabase.co`
- **Environment** : ✅ Production ✅ Preview ✅ Development

**Variable 2 :**
- **Name** : `VITE_SUPABASE_ANON_KEY`
- **Value** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (votre clé)
- **Environment** : ✅ Production ✅ Preview ✅ Development

### 2. Redéployer
1. **Deployments** → **...** → **Redeploy**
2. Ou faire un nouveau commit/push

## ✅ Vérification

### 1. Mode détecté automatiquement
L'application détecte automatiquement :
- **Mode Développement** : Si variables Supabase absentes/incorrectes
- **Mode Production** : Si variables Supabase configurées

### 2. Indicateurs visuels
- **Mode Développement** : Bannière jaune "Mode Développement Actif"
- **Mode Production** : Bannière verte "Mode Production Actif"

### 3. Console browser (F12)
```
🔧 Configuration PrestigeWash:
- Environnement: Production
- Supabase configuré: ✅
- URL Supabase: ✅
- Clé Supabase: ✅
📊 DataProvider Mode: production
```

## 🎉 Résultat attendu

Après configuration :
1. **Application charge** en mode production
2. **Authentification** Supabase active
3. **Données réelles** depuis la base
4. **Synchronisation temps réel**
5. **Toutes fonctionnalités** disponibles

## 🐛 Dépannage

### Si reste en mode développement
1. Vérifier variables d'environnement Vercel
2. Vérifier format URL Supabase (`https://...supabase.co`)
3. Vérifier longueur clé anonyme (>100 caractères)
4. Redéployer après changement

### Si erreurs d'authentification
1. Vérifier configuration URLs dans Supabase
2. Vérifier politiques RLS
3. Vérifier permissions tables

---

**Une fois configuré, PrestigeWash passera automatiquement en mode production ! 🚀**
