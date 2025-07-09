import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Types intégrés directement pour éviter les problèmes d'import
interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          title: string
          role: 'ceo' | 'director' | 'viewer'
          can_book: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          title: string
          role: 'ceo' | 'director' | 'viewer'
          can_book?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          title?: string
          role?: 'ceo' | 'director' | 'viewer'
          can_book?: boolean
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          booking_date: string
          time_slot: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          booking_date: string
          time_slot: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          booking_date?: string
          time_slot?: string
          updated_at?: string
        }
      }
    }
  }
}

// Configuration Supabase moderne avec TypeScript
interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  isProduction: boolean;
}

// Récupération sécurisée des variables d'environnement
const getSupabaseConfig = (): SupabaseConfig => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const isProduction = import.meta.env.PROD;
  
  // Validation des variables d'environnement
  const isConfigured = url.includes('supabase.co') && anonKey.length > 100;
  
  return {
    url,
    anonKey,
    isConfigured,
    isProduction
  };
};

// Configuration globale
const supabaseConfig = getSupabaseConfig();

// Création du client Supabase uniquement si configuré
let supabaseClient: SupabaseClient<Database> | null = null;

if (supabaseConfig.isConfigured) {
  supabaseClient = createClient<Database>(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  });
  
  console.log('✅ [SUPABASE] Client initialisé avec succès');
  console.log('🔗 [SUPABASE] URL:', supabaseConfig.url);
} else {
  console.warn('⚠️ [SUPABASE] Client non configuré - mode développement');
  console.warn('🔧 [SUPABASE] Variables manquantes:', {
    VITE_SUPABASE_URL: supabaseConfig.url ? '✅' : '❌',
    VITE_SUPABASE_ANON_KEY: supabaseConfig.anonKey ? '✅' : '❌'
  });
}

// Export du client (peut être null en mode développement)
export const supabase = supabaseClient;

// Utilitaires pour vérifier l'état de Supabase
export const isSupabaseConfigured = (): boolean => supabaseConfig.isConfigured;

export const getSupabaseStatus = () => ({
  isConfigured: supabaseConfig.isConfigured,
  isProduction: supabaseConfig.isProduction,
  hasUrl: !!supabaseConfig.url,
  hasKey: !!supabaseConfig.anonKey,
  client: !!supabaseClient
});

// Test de connectivité (optionnel)
export const testSupabaseConnection = async (): Promise<{
  success: boolean;
  error?: string;
  latency?: number;
}> => {
  if (!supabaseClient) {
    return { success: false, error: 'Client Supabase non configuré' };
  }
  
  try {
    const start = performance.now();
    const { error } = await supabaseClient.from('users').select('id').limit(1);
    const latency = performance.now() - start;
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, latency };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
};

// Types utilitaires exportés
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']

// Type pour l'utilisateur connecté
export interface SupabaseUser {
  id: string
  email: string
  name: string
  title: string
  role: 'ceo' | 'director' | 'viewer'
  canBook: boolean
}

// Guards pour vérifier que Supabase est disponible
export const requireSupabase = (): SupabaseClient<Database> => {
  if (!supabaseClient) {
    throw new Error('Supabase client not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
  }
  return supabaseClient;
};

export const withSupabase = <T>(
  callback: (client: SupabaseClient<Database>) => T
): T | null => {
  if (!supabaseClient) {
    console.warn('⚠️ [SUPABASE] Client non configuré - opération ignorée');
    return null;
  }
  return callback(supabaseClient);
};