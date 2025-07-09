// Types TypeScript pour la base de données Supabase
// Généré automatiquement à partir du schéma Supabase

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

// Types utilitaires pour l'application
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']

// Type pour l'utilisateur connecté avec propriétés réactives
export interface SupabaseUser {
  id: string
  email: string
  name: string
  title: string
  role: 'ceo' | 'director' | 'viewer'
  canBook: boolean
}

// Constantes pour les rôles et créneaux
export const UserRole = {
  CEO: 'ceo',
  DIRECTOR: 'director',
  VIEWER: 'viewer'
} as const;

export const TimeSlot = {
  MORNING: '08:00-10:00',
  MIDDAY: '10:00-12:00',
  AFTERNOON: '14:00-16:00'
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];
export type TimeSlotType = typeof TimeSlot[keyof typeof TimeSlot];
