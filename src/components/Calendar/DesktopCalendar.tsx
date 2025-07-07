import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Car, Clock, Trash2, AlertCircle } from 'lucide-react';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isToday, 
  isFriday,
  addMonths,
  subMonths,
  isBefore,
  startOfDay
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { CalendarSkeleton } from './CalendarSkeleton';
import { Spinner } from '../ui/Spinner';
import { useConfirm } from '../../hooks/useConfirm';
import { useSmartData, type Booking } from '../../contexts/SmartDataProvider';

interface DesktopCalendarProps {
  user: any;
  onBookingCreate?: (date: string, timeSlot: string) => void;
}

const timeSlots = [
  { id: '08:00-10:00', label: '08:00 - 10:00', start: '08:00', end: '10:00' },
  { id: '10:00-12:00', label: '10:00 - 12:00', start: '10:00', end: '12:00' },
  { id: '14:00-16:00', label: '14:00 - 16:00', start: '14:00', end: '16:00' }
];

export const DesktopCalendar: React.FC<DesktopCalendarProps> = ({ user, onBookingCreate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'current' | 'history'>('current');
  const [isBooking, setIsBooking] = useState(false);
  const [isCanceling, setIsCanceling] = useState<string | null>(null);

  // Utiliser le nouveau système de données Supabase
  const {
    bookingsLoading,
    createBooking,
    cancelBooking,
    getFutureBookings,
    getBookingsForDate,
  } = useSmartData();

  const { confirm } = useConfirm();

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' 
      ? subMonths(currentDate, 1) 
      : addMonths(currentDate, 1)
    );
  };

  const handleBookSlot = async (date: Date, timeSlot: string) => {
    if (!user?.id || isBooking) return;

    const shouldBook = await confirm({
      title: 'Confirmer la réservation',
      message: `Voulez-vous réserver le créneau ${timeSlot} pour le ${format(date, 'dd/MM/yyyy')} ?`,
      confirmText: 'Réserver',
      cancelText: 'Annuler'
    });

    if (!shouldBook) return;

    setIsBooking(true);
    try {
      await createBooking(user.id, date, timeSlot);
      onBookingCreate?.(format(date, 'yyyy-MM-dd'), timeSlot);
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelBooking = async (booking: Booking) => {
    const shouldCancel = await confirm({
      title: 'Confirmer l\'annulation',
      message: 'Cette action est irréversible. Voulez-vous vraiment annuler cette réservation ?',
      confirmText: 'Annuler la réservation',
      cancelText: 'Conserver',
      variant: 'danger'
    });

    if (!shouldCancel) return;

    setIsCanceling(booking.id);
    try {
      await cancelBooking(booking.id);
    } finally {
      setIsCanceling(null);
    }
  };

  // Obtenir les jours du mois
  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  };

  // Obtenir les réservations futures de l'utilisateur
  const userFutureBookings = user?.id ? getFutureBookings(user.id) : [];

  if (bookingsLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="calendar-container desktop-calendar">
      {/* En-tête du calendrier */}
      <Card className="calendar-header-card">
        <CardHeader>
          <div className="calendar-header">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateMonth('prev')}
              className="calendar-nav-button"
            >
              <ChevronLeft size={16} />
            </Button>
            
            <CardTitle className="calendar-title">
              {format(currentDate, 'MMMM yyyy', { locale: fr })}
            </CardTitle>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateMonth('next')}
              className="calendar-nav-button"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Sélecteur de vue */}
      <div className="view-selector">
        <Button
          variant={viewMode === 'current' ? 'default' : 'outline'}
          onClick={() => setViewMode('current')}
          size="sm"
        >
          Réservations à venir
        </Button>
        <Button
          variant={viewMode === 'history' ? 'default' : 'outline'}
          onClick={() => setViewMode('history')}
          size="sm"
        >
          Mes réservations futures
        </Button>
      </div>

      {viewMode === 'current' ? (
        /* Vue calendrier */
        <div className="calendar-grid-container">
          <div className="calendar-grid">
            {getDaysInMonth().map((day) => {
              const dayBookings = getBookingsForDate(day);
              const isAvailable = isFriday(day) && !isBefore(day, startOfDay(new Date()));

              return (
                <Card
                  key={day.toISOString()}
                  className={`calendar-day ${
                    isToday(day) ? 'calendar-day-today' : ''
                  } ${
                    isFriday(day) ? 'calendar-day-friday' : 'calendar-day-disabled'
                  }`}
                >
                  <CardHeader className="calendar-day-header">
                    <CardTitle className="calendar-day-number">
                      {format(day, 'd')}
                    </CardTitle>
                    <CardDescription className="calendar-day-name">
                      {format(day, 'EEE', { locale: fr })}
                    </CardDescription>
                  </CardHeader>
                  
                  {isFriday(day) && (
                    <CardContent className="calendar-day-content">
                      {!isAvailable && (
                        <div className="unavailable-message">
                          <AlertCircle size={16} />
                          <span>Passé</span>
                        </div>
                      )}
                      
                      <div className="time-slots">
                        {timeSlots.map((slot) => {
                          const booking = dayBookings.find((b: Booking) => b.time_slot === slot.id);
                          const isUserBooking = booking?.user_id === user?.id;
                          const isBooked = !!booking;
                          const canBook = isAvailable && !isBooked && user;
                          const canCancel = isUserBooking && !isBefore(day, startOfDay(new Date()));

                          return (
                            <Button
                              key={slot.id}
                              onClick={() => {
                                if (canBook) {
                                  handleBookSlot(day, slot.id);
                                } else if (canCancel && booking) {
                                  handleCancelBooking(booking);
                                }
                              }}
                              disabled={!canBook && !canCancel}
                              variant={
                                isUserBooking ? 'outline' : 
                                isBooked ? 'secondary' : 
                                'default'
                              }
                              size="sm"
                              className={`time-slot-button ${
                                isBooked ? 'booked' : 'available'
                              } ${isUserBooking ? 'user-booking' : ''}`}
                            >
                              <div className="slot-content">
                                <Clock size={12} />
                                <span className="slot-time">{slot.label}</span>
                                {isBooked && (
                                  <div className="slot-status">
                                    {isUserBooking ? (
                                      canCancel && <Trash2 size={12} />
                                    ) : (
                                      <Car size={12} />
                                    )}
                                  </div>
                                )}
                                {(isBooking || (isCanceling === booking?.id)) && (
                                  <Spinner size="sm" />
                                )}
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* Vue réservations futures */
        <div className="future-bookings-container">
          {userFutureBookings.length === 0 ? (
            <Card className="no-bookings-card">
              <CardContent>
                <div className="no-bookings-content">
                  <AlertCircle size={48} />
                  <h3>Aucune réservation future</h3>
                  <p>Vous n'avez pas encore de réservations programmées.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            userFutureBookings.map((booking: Booking) => (
              <Card key={booking.id} className="future-booking-card">
                <CardHeader>
                  <div className="booking-header">
                    <div className="booking-info">
                      <CardTitle>
                        {format(new Date(booking.date), 'EEEE d MMMM yyyy', { locale: fr })}
                      </CardTitle>
                      <CardDescription>
                        <Clock size={16} />
                        {booking.time_slot}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => handleCancelBooking(booking)}
                      disabled={isCanceling === booking.id}
                      variant="outline"
                      size="sm"
                      className="cancel-button"
                    >
                      {isCanceling === booking.id ? (
                        <Spinner size="sm" text="Annulation..." />
                      ) : (
                        <>
                          <Trash2 size={16} />
                          Annuler
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
