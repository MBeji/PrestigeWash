// Amélioration: Gestion des réservations avec Supabase
import { Database } from '../types/supabase'

export interface DatabaseBooking {
  id: string
  user_id: string
  booking_date: string
  time_slot: string
  created_at: string
  updated_at: string
}

// Hook pour la gestion des réservations
export const useBookings = () => {
  const [bookings, setBookings] = useState<DatabaseBooking[]>([])
  const [loading, setLoading] = useState(true)

  // Charger les réservations depuis Supabase
  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: true })
    
    if (error) throw error
    setBookings(data)
    setLoading(false)
  }

  // Créer une réservation
  const createBooking = async (booking: Omit<DatabaseBooking, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
    
    if (error) throw error
    setBookings(prev => [...prev, data[0]])
    return data[0]
  }

  // Supprimer une réservation
  const deleteBooking = async (id: string) => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  return {
    bookings,
    loading,
    fetchBookings,
    createBooking,
    deleteBooking
  }
}
