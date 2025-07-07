import React, { useState, useEffect } from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { CalendarSkeleton } from './Calendar/CalendarSkeleton';
import { Spinner } from './ui/Spinner';
import { useToast } from '../contexts/ToastContext';
import { useConfirm } from '../hooks/useConfirm';
import { useData } from '../contexts/DataContext';

interface CalendarProps {
  user: any;
  onBookingCreate?: (date: string, timeSlot: string) => void;
}

const timeSlots = [
  { id: '08:00-10:00', label: '08:00 - 10:00', start: '08:00', end: '10:00' },
  { id: '10:00-12:00', label: '10:00 - 12:00', start: '10:00', end: '12:00' },
  { id: '14:00-16:00', label: '14:00 - 16:00', start: '14:00', end: '16:00' }
];

export const Calendar: React.FC<CalendarProps> = ({ user, onBookingCreate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'current' | 'history'>('current');
  const [isBooking, setIsBooking] = useState(false);
  const [isCanceling, setIsCanceling] = useState<string | null>(null);
  
  // Utiliser le nouveau système de données Supabase
  const {
    bookings,
    bookingsLoading,
    createBooking,
    cancelBooking,
    getUserBookings,
    getFutureBookings,
    getBookingsForDate,
    canUserBook
  } = useData();
  const [isCanceling, setIsCanceling] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess, showError, showWarning } = useToast();
  const { confirm, confirmState, closeDialog } = useConfirm();  // Simuler quelques réservations pour la démonstration
  useEffect(() => {
    const loadBookings = async () => {
      setIsLoading(true);
      
      // Simuler un délai de chargement réaliste
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const mockBookings: Booking[] = [
        {
          id: '1',
          user_id: 'user1',
          booking_date: '2025-07-11', // Un vendredi
          time_slot: '09:00-11:30',
          user_email: 'jean@example.com',
          created_at: '2025-07-01T10:00:00Z'
        },
        {
          id: '2',
          user_id: 'user2',
          booking_date: '2025-07-11',
          time_slot: '14:00-16:30',
          user_email: 'marie@example.com',
          created_at: '2025-07-01T11:00:00Z'
        },
        {
          id: '3',
          user_id: 'user3',
          booking_date: '2025-07-18',
          time_slot: '11:30-14:00',
          user_email: 'paul@example.com',
          created_at: '2025-07-01T12:00:00Z'
        },
        // Réservation de l'utilisateur connecté pour tester la règle des 3 semaines
        {
          id: '5',
          user_id: 'dev-user-id', // L'ID de l'utilisateur en mode dev
          booking_date: '2025-07-25', // Dans 3 semaines
          time_slot: '09:00-11:30',
          user_email: 'user@example.com',
          created_at: '2025-07-01T14:00:00Z'
        },
        // Historique
        {
          id: '4',
          user_id: 'user4',
          booking_date: '2025-06-27',
          time_slot: '09:00-11:30',
          user_email: 'alice@example.com',
          created_at: '2025-06-20T10:00:00Z'
        }
      ];
      
      setBookings(mockBookings);
      setIsLoading(false);
    };

    loadBookings();
  }, []);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  const getMonthFridays = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const allDays = eachDayOfInterval({ start, end });
    return allDays.filter(day => isFriday(day));
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookings.filter(booking => booking.booking_date === dateStr);
  };

  const isSlotAvailable = (date: Date, slotId: string) => {
    const dateBookings = getBookingsForDate(date);
    return !dateBookings.some(booking => booking.time_slot === slotId);
  };  const canBookSlot = (date: Date, slotId: string) => {
    // Les utilisateurs en mode "viewer" ne peuvent pas réserver
    if (!user.canBook) return false;
    
    if (!isFriday(date)) return false;
    if (isBefore(date, startOfDay(new Date()))) return false;
    if (!isSlotAvailable(date, slotId)) return false;
    
    // Vérifier la règle des 3 semaines
    if (!canUserBookInPeriod(date)) return false;
    
    return true;
  };
  const canUserBookInPeriod = (bookingDate: Date) => {
    // Calculer la période de 3 semaines (21 jours) autour de la date de réservation
    const threeWeeksBefore = new Date(bookingDate);
    threeWeeksBefore.setDate(threeWeeksBefore.getDate() - 21);
    
    const threeWeeksAfter = new Date(bookingDate);
    threeWeeksAfter.setDate(threeWeeksAfter.getDate() + 21);
    
    // Vérifier si l'utilisateur a déjà une réservation dans cette période
    const userBookingsInPeriod = bookings.filter(booking => {
      if (booking.user_id !== user.id) return false;
      
      const bookingDateObj = new Date(booking.booking_date);
      return bookingDateObj >= threeWeeksBefore && bookingDateObj <= threeWeeksAfter;
    });
    
    return userBookingsInPeriod.length === 0;
  };  const handleCancelBooking = async (booking: Booking) => {
    if (isCanceling === booking.id) return; // Éviter les double-clics
    
    const bookingDate = new Date(booking.booking_date);
    const today = new Date();
    
    // Vérifier que c'est une réservation future
    if (isBefore(bookingDate, startOfDay(today))) {
      showError('Impossible d\'annuler', 'Vous ne pouvez pas annuler une réservation passée.');
      return;
    }
    
    // Vérifier que c'est bien la réservation de l'utilisateur connecté
    if (booking.user_id !== user.id) {
      showError('Action non autorisée', 'Vous ne pouvez annuler que vos propres réservations.');
      return;
    }
    
    const timeSlot = timeSlots.find(slot => slot.id === booking.time_slot);
    const formattedDate = format(bookingDate, 'EEEE d MMMM yyyy', { locale: fr });
    
    const shouldCancel = await confirm({
      title: 'Confirmer l\'annulation',
      message: `Date : ${formattedDate}\nCréneau : ${timeSlot?.label}\n\nCette action est irréversible.`,
      confirmText: 'Annuler la réservation',
      cancelText: 'Conserver',
      variant: 'danger'
    });

    if (shouldCancel) {
      setIsCanceling(booking.id);
      
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setBookings(prev => prev.filter(b => b.id !== booking.id));
      setIsCanceling(null);
      
      // Message de confirmation avec toast
      showSuccess(
        'Réservation annulée !', 
        `${format(bookingDate, 'EEEE d MMMM', { locale: fr })} - ${timeSlot?.label}`
      );
    }
  };const handleBooking = async (date: Date, slotId: string) => {
    if (isBooking) return; // Éviter les double-clics
    
    if (!user.canBook) {
      showError(
        'Accès refusé', 
        'Vous êtes en mode visualisation seule. Seuls les membres du CODIR peuvent effectuer des réservations.'
      );
      return;
    }

    if (!canBookSlot(date, slotId)) {
      if (!canUserBookInPeriod(date)) {
        showWarning(
          'Réservation impossible', 
          'Vous avez déjà une réservation dans les 3 semaines autour de cette date. Règle du club : Un seul créneau par période de 3 semaines.'
        );
        return;
      }
      showError('Créneau indisponible', 'Ce créneau n\'est pas disponible pour la réservation.');
      return;
    }
    
    setIsBooking(true);
    
    // Simuler un délai de traitement de réservation
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const newBooking: Booking = {
      id: Date.now().toString(),
      user_id: user.id,
      booking_date: dateStr,
      time_slot: slotId,
      user_email: user.email,
      created_at: new Date().toISOString()
    };

    setBookings(prev => [...prev, newBooking]);
    onBookingCreate?.(dateStr, slotId);
    setIsBooking(false);
    
    // Message de confirmation avec toast VIP
    showSuccess(
      '🚗 Réservation VIP confirmée !',
      `${user.name} - ${format(date, 'EEEE d MMMM', { locale: fr })} - ${timeSlots.find(s => s.id === slotId)?.label}`
    );
  };const renderFridayCard = (date: Date) => {
    const dayBookings = getBookingsForDate(date);
    const isPast = isBefore(date, startOfDay(new Date()));
    const canUserBook = canUserBookInPeriod(date);
    
    return (
      <div
        key={date.toISOString()}
        className={`friday-card ${isPast ? 'past' : ''} ${isToday(date) ? 'today' : ''} ${!canUserBook && !isPast ? 'restricted' : ''}`}
        onClick={() => !isPast && canUserBook ? setSelectedDate(date) : null}
      >
        <div className="friday-header">
          <div className="friday-date">
            <div className="day-number">{format(date, 'd')}</div>
            <div className="day-name">Vendredi</div>
            <div className="full-date">{format(date, 'd MMMM', { locale: fr })}</div>
          </div>
          <div className="friday-badges">
            {isToday(date) && <div className="today-badge">Aujourd'hui</div>}
            {!canUserBook && !isPast && (
              <div className="restriction-badge" title="Vous avez déjà une réservation dans les 3 semaines autour de cette date">
                Période bloquée
              </div>
            )}
          </div>
        </div>
        
        <div className="friday-slots">
          {timeSlots.map(slot => {
            const booking = dayBookings.find(b => b.time_slot === slot.id);
            const available = isSlotAvailable(date, slot.id);
            const canBook = canBookSlot(date, slot.id);
            
            return (
              <div
                key={slot.id}
                className={`slot-card ${
                  !available ? 'booked' : 
                  !canBook ? 'restricted' : 
                  'available'
                } ${isPast ? 'past' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (canBook) {
                    handleBooking(date, slot.id);
                  }
                }}
                title={
                  booking ? `Réservé par ${booking.user_email}` :
                  !canUserBook && !isPast ? 'Vous ne pouvez pas réserver dans cette période (règle des 3 semaines)' :
                  isPast ? 'Créneau passé' :
                  available ? 'Cliquez pour réserver' : 'Créneau indisponible'
                }
              >
                <div className="slot-time">
                  <Clock style={{ width: '14px', height: '14px' }} />
                  <span>{slot.label}</span>
                </div>                <div className="slot-status">
                  {booking ? (
                    <div className="booking-info">
                      <span className="booked-indicator">●</span>
                      <span className="booker-email">{booking.user_email?.split('@')[0]}</span>
                      {booking.user_id === user.id && !isPast && (
                        <button
                          className="cancel-booking-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelBooking(booking);
                          }}
                          title="Annuler ma réservation"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className={`status-text ${
                      isPast ? 'past' : 
                      !canBook ? 'restricted' : 
                      'available'
                    }`}>
                      {isPast ? 'Passé' : 
                       !canUserBook ? 'Bloqué' :
                       !available ? 'Pris' : 
                       'Libre'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {!canUserBook && !isPast && (
          <div className="restriction-info">
            <p className="restriction-text">
              ⚠️ Vous ne pouvez pas réserver ce vendredi car vous avez déjà une réservation dans les 3 semaines autour de cette date.
            </p>
          </div>
        )}
      </div>
    );
  };
  const renderMonthGrid = (date: Date) => {
    const fridays = getMonthFridays(date);
    const monthName = format(date, 'MMMM yyyy', { locale: fr });
    
    return (
      <div key={date.toISOString()} className="month-container">
        <h3 className="month-title">{monthName}</h3>
        <div className="fridays-container">
          {fridays.length > 0 ? (
            fridays.map(friday => renderFridayCard(friday))
          ) : (
            <div className="no-fridays">
              <p>Aucun vendredi ce mois-ci</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Générer les mois à afficher
  const getMonthsToDisplay = () => {
    if (viewMode === 'history') {
      // Afficher les 3 derniers mois
      return [
        subMonths(new Date(), 2),
        subMonths(new Date(), 1),
        new Date()
      ];
    } else {
      // Afficher le mois actuel et les 2 suivants
      return [
        currentDate,
        addMonths(currentDate, 1),
        addMonths(currentDate, 2)
      ];
    }
  };

  // Obtenir les réservations futures de l'utilisateur
  const getUserFutureBookings = () => {
    const today = startOfDay(new Date());
    return bookings
      .filter(booking => 
        booking.user_id === user.id && 
        !isBefore(new Date(booking.booking_date), today)
      )
      .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime());
  };

  const userFutureBookings = getUserFutureBookings();
  // Afficher le skeleton pendant le chargement
  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="calendar-container">
      {/* Section des réservations de l'utilisateur */}
      {userFutureBookings.length > 0 && user.canBook && (
        <Card className="user-bookings-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle style={{ width: '18px', height: '18px', color: '#3b82f6' }} />
              Mes Réservations Futures
            </CardTitle>
            <CardDescription>
              Vous pouvez annuler vos réservations futures si vous souhaitez changer de créneau
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="user-bookings-list">
              {userFutureBookings.map(booking => {
                const bookingDate = new Date(booking.booking_date);
                const timeSlot = timeSlots.find(slot => slot.id === booking.time_slot);
                
                return (
                  <div key={booking.id} className="user-booking-item">
                    <div className="booking-date-info">
                      <div className="booking-day">
                        {format(bookingDate, 'EEE', { locale: fr })}
                      </div>
                      <div className="booking-date">
                        {format(bookingDate, 'd MMM', { locale: fr })}
                      </div>
                    </div>
                    
                    <div className="booking-details">
                      <div className="booking-time">
                        <Clock style={{ width: '14px', height: '14px' }} />
                        <span>{timeSlot?.label}</span>
                      </div>
                      <div className="booking-full-date">
                        {format(bookingDate, 'EEEE d MMMM yyyy', { locale: fr })}
                      </div>
                    </div>                      <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelBooking(booking)}
                      className="cancel-booking-button"
                      disabled={isCanceling === booking.id}
                    >
                      {isCanceling === booking.id ? (
                        <Spinner size="sm" text="Annulation..." />
                      ) : (
                        <>
                          <Trash2 style={{ width: '14px', height: '14px' }} />
                          Annuler
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Car style={{ width: '20px', height: '20px' }} />
              Calendrier des Réservations
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'current' ? 'default' : 'outline'}
                onClick={() => setViewMode('current')}
                size="sm"
              >
                À venir
              </Button>
              <Button
                variant={viewMode === 'history' ? 'default' : 'outline'}
                onClick={() => setViewMode('history')}
                size="sm"
              >
                Historique
              </Button>
            </div>
          </div>          <CardDescription>
            {viewMode === 'current' 
              ? 'Réservez votre créneau de lavage pour les vendredis à venir (9h-11h30, 11h30-14h, 14h-16h30). Règle : 1 seul créneau par période de 3 semaines.'
              : 'Consultez l\'historique de vos réservations passées'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {viewMode === 'current' && (
            <div className="calendar-navigation">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
                Mois précédent
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                Mois suivant
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </Button>
            </div>
          )}
          
          <div className="months-display">
            {getMonthsToDisplay().map(month => renderMonthGrid(month))}
          </div>
          
          <div className="calendar-legend">
            <h4>Légende :</h4>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color available"></div>
                <span>Créneau disponible</span>
              </div>
              <div className="legend-item">
                <div className="legend-color booked"></div>
                <span>Créneau réservé</span>
              </div>
              <div className="legend-item">
                <div className="legend-color today"></div>
                <span>Aujourd'hui</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de réservation rapide */}
      {selectedDate && (
        <Card className="booking-modal">
          <CardHeader>
            <CardTitle>
              Réserver pour le {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </CardTitle>
            <CardDescription>
              Choisissez votre créneau de lavage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="booking-slots">
              {timeSlots.map(slot => {
                const available = canBookSlot(selectedDate, slot.id);
                return (                  <Button
                    key={slot.id}
                    variant={available ? 'outline' : 'ghost'}
                    className={`booking-slot ${!available ? 'disabled' : ''}`}
                    onClick={() => available ? handleBooking(selectedDate, slot.id) : null}
                    disabled={!available || isBooking}
                  >
                    {isBooking ? (
                      <Spinner size="sm" />
                    ) : (
                      <>
                        <Clock style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                        {slot.label}
                        {!available && <span className="ml-2">●</span>}
                      </>
                    )}
                  </Button>
                );
              })}
            </div>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setSelectedDate(null)}>
                Annuler
              </Button>
            </div>
          </CardContent>        </Card>
      )}

      {/* Dialog de confirmation */}
      {confirmState && (
        <ConfirmDialog
          isOpen={confirmState.isOpen}
          onClose={closeDialog}
          onConfirm={confirmState.onConfirm}
          title={confirmState.title}
          message={confirmState.message}
          confirmText={confirmState.confirmText}
          cancelText={confirmState.cancelText}
          variant={confirmState.variant}
          icon={confirmState.icon}
          isLoading={confirmState.isLoading}
        />
      )}
    </div>
  );
};
