import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key'

// Vérification des variables d'environnement en production
if (import.meta.env.PROD && (supabaseUrl.includes('dummy') || supabaseAnonKey.includes('dummy'))) {
  throw new Error('Missing Supabase environment variables in production')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Types pour TypeScript
export interface Database {
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

// Type pour l'utilisateur connecté
export interface SupabaseUser {
  id: string
  email: string
  name: string
  title: string
  role: 'ceo' | 'director' | 'viewer'
  canBook: boolean
}
