import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useToast } from '../contexts/ToastContext'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export interface Booking {
  id: string
  user_id: string
  date: string
  time_slot: '08:00-10:00' | '10:00-12:00' | '14:00-16:00'
  created_at: string
  updated_at: string
  // Relations avec les autres tables
  user?: {
    id: string
    name: string
    email: string
    title: string
  }
}

interface UseBookingsReturn {
  bookings: Booking[]
  loading: boolean
  error: string | null
  createBooking: (userId: string, date: Date, timeSlot: string) => Promise<boolean>
  cancelBooking: (bookingId: string) => Promise<boolean>
  getUserBookings: (userId: string) => Booking[]
  getFutureBookings: (userId: string) => Booking[]
  getBookingsForDate: (date: Date) => Booking[]
  canUserBook: (userId: string, date: Date) => { canBook: boolean; reason?: string }
  refreshBookings: () => Promise<void>
}

export const useBookings = (): UseBookingsReturn => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showError, showSuccess } = useToast()

  // Récupérer toutes les réservations
  const fetchBookings = async () => {    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          id,
          user_id,
          date,
          time_slot,
          created_at,
          updated_at,
          users!inner(
            id,
            name,
            email,
            title
          )
        `)
        .order('date', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      // Transformer les données pour correspondre à notre interface
      const transformedBookings: Booking[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        date: item.date,
        time_slot: item.time_slot,
        created_at: item.created_at,
        updated_at: item.updated_at,
        user: Array.isArray(item.users) ? item.users[0] : item.users
      }))

      setBookings(transformedBookings)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des réservations'
      setError(errorMessage)
      showError('Erreur de chargement', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Créer une nouvelle réservation
  const createBooking = async (userId: string, date: Date, timeSlot: string): Promise<boolean> => {
    try {
      // Vérifier si l'utilisateur peut réserver
      const { canBook, reason } = canUserBook(userId, date)
      if (!canBook) {
        showError('Réservation impossible', reason || 'Vous ne pouvez pas réserver ce créneau')
        return false
      }

      const { data, error: insertError } = await supabase
        .from('bookings')
        .insert({
          user_id: userId,
          date: format(date, 'yyyy-MM-dd'),
          time_slot: timeSlot
        })        .select(`
          id,
          user_id,
          date,
          time_slot,
          created_at,
          updated_at,
          users!inner(
            id,
            name,
            email,
            title
          )
        `)
        .single()

      if (insertError) {
        throw insertError
      }

      // Ajouter la nouvelle réservation à l'état local
      if (data) {
        const newBooking: Booking = {
          id: data.id,
          user_id: data.user_id,
          date: data.date,
          time_slot: data.time_slot,
          created_at: data.created_at,
          updated_at: data.updated_at,
          user: Array.isArray(data.users) ? data.users[0] : data.users
        }
        
        setBookings(prev => [...prev, newBooking].sort((a, b) => a.date.localeCompare(b.date)))
        showSuccess(
          'Réservation confirmée !',
          `${format(date, 'EEEE dd MMMM yyyy', { locale: fr })} - ${timeSlot}`
        )
      }

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la réservation'
      showError('Erreur de réservation', errorMessage)
      return false
    }
  }

  // Annuler une réservation
  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId)

      if (deleteError) {
        throw deleteError
      }

      // Supprimer la réservation de l'état local
      setBookings(prev => prev.filter(booking => booking.id !== bookingId))
      showSuccess('Réservation annulée', 'Votre réservation a été supprimée avec succès')

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'annulation'
      showError('Erreur d\'annulation', errorMessage)
      return false
    }
  }

  // Obtenir les réservations d'un utilisateur
  const getUserBookings = (userId: string): Booking[] => {
    return bookings.filter(booking => booking.user_id === userId)
  }

  // Obtenir les réservations futures d'un utilisateur
  const getFutureBookings = (userId: string): Booking[] => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return bookings.filter(booking => 
      booking.user_id === userId && booking.date >= today
    )
  }

  // Obtenir les réservations pour une date
  const getBookingsForDate = (date: Date): Booking[] => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return bookings.filter(booking => booking.date === dateStr)
  }

  // Vérifier si un utilisateur peut réserver
  const canUserBook = (userId: string, date: Date): { canBook: boolean; reason?: string } => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const today = new Date()
    const bookingDate = new Date(date)

    // Vérifier si la date est dans le futur
    if (bookingDate <= today) {
      return { canBook: false, reason: 'Impossible de réserver dans le passé' }
    }

    // Vérifier si c'est un vendredi
    if (bookingDate.getDay() !== 5) {
      return { canBook: false, reason: 'Les réservations ne sont autorisées que le vendredi' }
    }

    // Vérifier la règle des 3 semaines
    const userBookings = getUserBookings(userId)
    const lastBooking = userBookings
      .filter(booking => booking.date < dateStr)
      .sort((a, b) => b.date.localeCompare(a.date))[0]

    if (lastBooking) {
      const lastBookingDate = new Date(lastBooking.date)
      const daysDiff = Math.floor((bookingDate.getTime() - lastBookingDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff < 21) { // 3 semaines = 21 jours
        const daysRemaining = 21 - daysDiff
        return { 
          canBook: false, 
          reason: `Vous devez attendre ${daysRemaining} jour(s) avant votre prochaine réservation` 
        }
      }
    }

    return { canBook: true }
  }

  // Fonction pour rafraîchir les données
  const refreshBookings = async () => {
    await fetchBookings()
  }

  // Charger les données au montage
  useEffect(() => {
    fetchBookings()
  }, [])

  // S'abonner aux changements en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('bookings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          // Recharger les données quand il y a des changements
          fetchBookings()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    bookings,
    loading,
    error,
    createBooking,
    cancelBooking,
    getUserBookings,
    getFutureBookings,
    getBookingsForDate,
    canUserBook,
    refreshBookings
  }
}
