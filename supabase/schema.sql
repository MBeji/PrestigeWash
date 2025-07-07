-- Auto Wash Club VIP Database Schema
-- Créer les tables pour l'application de réservation

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('ceo', 'director', 'viewer')),
  can_book BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des réservations
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes pour éviter les doublons
  UNIQUE(booking_date, time_slot)
);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON bookings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Données d'exemple pour les utilisateurs CODIR
INSERT INTO users (email, name, title, role, can_book) VALUES
  ('ceo@codir.com', 'Jean Dupont', 'CEO', 'ceo', true),
  ('directeur.commercial@codir.com', 'Marie Martin', 'Directrice Commerciale', 'director', true),
  ('directeur.technique@codir.com', 'Pierre Bernard', 'Directeur Technique', 'director', true),
  ('directeur.rh@codir.com', 'Sophie Dubois', 'Directrice RH', 'director', true),
  ('directeur.finance@codir.com', 'Paul Moreau', 'Directeur Financier', 'director', true),
  ('directeur.marketing@codir.com', 'Julie Laurent', 'Directrice Marketing', 'director', true),
  ('directeur.production@codir.com', 'Michel Petit', 'Directeur Production', 'director', true),
  ('directeur.qualite@codir.com', 'Anne Simon', 'Directrice Qualité', 'director', true),
  ('directeur.logistique@codir.com', 'Robert Leroy', 'Directeur Logistique', 'director', true),
  ('directeur.innovation@codir.com', 'Claire Roux', 'Directrice Innovation', 'director', true),
  ('directeur.international@codir.com', 'Thomas David', 'Directeur International', 'director', true),
  ('assistant.direction@codir.com', 'Émilie Blanc', 'Assistante de Direction', 'viewer', false),
  ('secretaire.codir@codir.com', 'Nathalie Vincent', 'Secrétaire CODIR', 'viewer', false)
ON CONFLICT (email) DO NOTHING;

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_date_slot ON bookings(booking_date, time_slot);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- RLS (Row Level Security) pour la sécurité
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Politique pour les utilisateurs (peuvent voir leur propre profil et tous les autres)
CREATE POLICY "Users can read all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Politique pour les réservations
CREATE POLICY "Users can read all bookings" ON bookings
  FOR SELECT USING (true);

CREATE POLICY "Users can create own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookings" ON bookings
  FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour valider les règles de réservation (3 semaines)
CREATE OR REPLACE FUNCTION check_booking_rules()
RETURNS TRIGGER AS $$
DECLARE
  existing_booking_date DATE;
  days_difference INTEGER;
BEGIN
  -- Vérifier la règle des 3 semaines (21 jours)
  SELECT booking_date INTO existing_booking_date
  FROM bookings 
  WHERE user_id = NEW.user_id 
    AND booking_date != NEW.booking_date
  ORDER BY booking_date DESC 
  LIMIT 1;
  
  IF existing_booking_date IS NOT NULL THEN
    days_difference := ABS(NEW.booking_date - existing_booking_date);
    
    IF days_difference < 21 THEN
      RAISE EXCEPTION 'Vous devez attendre au moins 3 semaines (21 jours) entre deux réservations. Dernière réservation: %', existing_booking_date;
    END IF;
  END IF;
  
  -- Vérifier que c'est un vendredi
  IF EXTRACT(DOW FROM NEW.booking_date) != 5 THEN
    RAISE EXCEPTION 'Les réservations ne sont autorisées que le vendredi';
  END IF;
  
  -- Vérifier que la date est dans le futur
  IF NEW.booking_date <= CURRENT_DATE THEN
    RAISE EXCEPTION 'Les réservations ne peuvent être faites que pour des dates futures';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour valider les règles de réservation
CREATE TRIGGER validate_booking_rules
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_booking_rules();

-- Vue pour les statistiques d'utilisation
CREATE OR REPLACE VIEW booking_stats AS
SELECT 
  u.name,
  u.role,
  COUNT(b.id) as total_bookings,
  MAX(b.booking_date) as last_booking,
  MIN(b.booking_date) as first_booking
FROM users u
LEFT JOIN bookings b ON u.id = b.user_id
GROUP BY u.id, u.name, u.role
ORDER BY total_bookings DESC;

-- Commentaires pour la documentation
COMMENT ON TABLE users IS 'Table des utilisateurs autorisés (membres CODIR + viewers)';
COMMENT ON TABLE bookings IS 'Table des réservations de créneaux de lavage';
COMMENT ON FUNCTION check_booking_rules() IS 'Valide les règles métier des réservations (3 semaines, vendredis uniquement)';
COMMENT ON VIEW booking_stats IS 'Statistiques d\'utilisation par utilisateur';
