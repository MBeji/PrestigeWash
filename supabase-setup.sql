-- Configuration SQL pour Supabase - Mode Production
-- Tables et politiques de sécurité pour PrestigeWash

-- 1. Activer RLS (Row Level Security)
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- 2. Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  role TEXT CHECK (role IN ('ceo', 'director', 'viewer')) DEFAULT 'viewer',
  can_book BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false, -- Nécessite approbation admin
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table des réservations
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT CHECK (time_slot IN ('08:00-10:00', '10:00-12:00', '14:00-16:00')) NOT NULL,
  status TEXT CHECK (status IN ('confirmed', 'cancelled')) DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  UNIQUE(booking_date, time_slot), -- Un seul utilisateur par créneau
  CHECK (EXTRACT(DOW FROM booking_date) = 5) -- Seulement les vendredis (5 = vendredi)
);

-- 4. Table des demandes d'accès en attente
CREATE TABLE IF NOT EXISTS public.access_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  requested_role TEXT CHECK (requested_role IN ('director', 'viewer')) DEFAULT 'viewer',
  message TEXT, -- Message de justification
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.users(id),
  review_notes TEXT
);

-- 5. Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, title, role, can_book, is_approved)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Nouvel Utilisateur'),
    COALESCE(NEW.raw_user_meta_data->>'title', 'Membre'),
    'viewer',
    false,
    false -- Nécessite approbation
  );
  
  -- Créer une demande d'accès
  INSERT INTO public.access_requests (user_id, email, name, title, requested_role, message)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Nouvel Utilisateur'),
    COALESCE(NEW.raw_user_meta_data->>'title', 'Membre'),
    'viewer',
    'Demande d''accès automatique lors de l''inscription'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger pour la création automatique de profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Fonction de mise à jour automatique du timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Triggers pour updated_at
CREATE TRIGGER handle_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Politiques de sécurité RLS

-- Users : Les utilisateurs peuvent voir leur propre profil et ceux approuvés
CREATE POLICY "Users can read approved profiles" ON public.users
  FOR SELECT USING (is_approved = true OR auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Bookings : Seuls les utilisateurs approuvés peuvent réserver
CREATE POLICY "Approved users can read bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_approved = true
    )
  );

CREATE POLICY "Approved users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND is_approved = true AND can_book = true
    )
  );

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own bookings" ON public.bookings
  FOR DELETE USING (user_id = auth.uid());

-- Access requests : Les utilisateurs peuvent voir leurs propres demandes
CREATE POLICY "Users can read their own access requests" ON public.access_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create access requests" ON public.access_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- 10. Politiques pour les administrateurs (CEO)
CREATE POLICY "CEO can manage all users" ON public.users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'ceo' AND is_approved = true
    )
  );

CREATE POLICY "CEO can manage all access requests" ON public.access_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'ceo' AND is_approved = true
    )
  );

-- 11. Insérer le premier administrateur (à adapter avec votre email)
INSERT INTO public.users (
  id, 
  email, 
  name, 
  title, 
  role, 
  can_book, 
  is_approved,
  approved_at,
  approved_by
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Remplacer par l'UUID de votre compte
  'admin@codir.com', -- Remplacer par votre email
  'Administrateur Principal',
  'CEO',
  'ceo',
  true,
  true,
  NOW(),
  '00000000-0000-0000-0000-000000000000'
) ON CONFLICT (id) DO NOTHING;
