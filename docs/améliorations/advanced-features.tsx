// Amélioration: Système de notifications et rappels
export interface Notification {
  id: string
  user_id: string
  type: 'booking_reminder' | 'booking_cancelled' | 'system_maintenance'
  title: string
  message: string
  read: boolean
  created_at: string
}

// Hook pour les notifications
export const useNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Marquer comme lu
  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
    
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  // Créer une notification de rappel
  const createBookingReminder = async (booking: DatabaseBooking) => {
    const reminderDate = new Date(booking.booking_date)
    reminderDate.setHours(reminderDate.getHours() - 24) // 24h avant

    const notification: Omit<Notification, 'id' | 'created_at'> = {
      user_id: booking.user_id,
      type: 'booking_reminder',
      title: 'Rappel de réservation',
      message: `N'oubliez pas votre créneau de lavage demain de ${booking.time_slot}`,
      read: false
    }

    // Programmer la notification (avec un service worker ou cron job)
    // Pour la démo, on peut utiliser setTimeout
    const delay = reminderDate.getTime() - Date.now()
    if (delay > 0) {
      setTimeout(() => {
        // Envoyer notification push ou email
        sendPushNotification(notification)
      }, delay)
    }
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    createBookingReminder
  }
}

// Service de notifications push
export const sendPushNotification = async (notification: Notification) => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const registration = await navigator.serviceWorker.ready
    await registration.showNotification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.id,
      data: notification
    })
  }
}

// Composant Stats pour l'admin
export const AdminStats = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    todayBookings: 0,
    weekBookings: 0,
    monthBookings: 0,
    mostActiveUser: '',
    averageBookingsPerWeek: 0
  })

  const fetchStats = async () => {
    // Requêtes Supabase pour les statistiques
    const today = new Date().toISOString().split('T')[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const [totalRes, todayRes, weekRes, monthRes] = await Promise.all([
      supabase.from('bookings').select('count'),
      supabase.from('bookings').select('count').eq('booking_date', today),
      supabase.from('bookings').select('count').gte('booking_date', weekAgo),
      supabase.from('bookings').select('count').gte('booking_date', monthAgo)
    ])

    setStats({
      totalBookings: totalRes.count || 0,
      todayBookings: todayRes.count || 0,
      weekBookings: weekRes.count || 0,
      monthBookings: monthRes.count || 0,
      mostActiveUser: 'Dorsaf', // À calculer
      averageBookingsPerWeek: ((weekRes.count || 0) / 1)
    })
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900">Total Réservations</h3>
        <p className="text-2xl font-bold text-blue-700">{stats.totalBookings}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-green-900">Aujourd'hui</h3>
        <p className="text-2xl font-bold text-green-700">{stats.todayBookings}</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-900">Cette Semaine</h3>
        <p className="text-2xl font-bold text-yellow-700">{stats.weekBookings}</p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-purple-900">Ce Mois</h3>
        <p className="text-2xl font-bold text-purple-700">{stats.monthBookings}</p>
      </div>
    </div>
  )
}
