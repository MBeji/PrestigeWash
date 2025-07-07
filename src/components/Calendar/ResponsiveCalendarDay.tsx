import React from 'react';
import { format, isFriday, isToday, isBefore, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Car, Clock, Trash2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { useConfirm } from '../../hooks/useConfirm';
import type { Booking } from '../../contexts/DataContext-dev';

interface ResponsiveCalendarDayProps {
  day: Date;
  dayBookings: Booking[];
  user: any;
  timeSlots: Array<{
    id: string;
    label: string;
    start: string;
    end: string;
  }>;
  isBooking: boolean;
  isCanceling: string | null;
  onBookSlot: (date: Date, timeSlot: string) => void;
  onCancelBooking: (booking: Booking) => void;
  isMobile?: boolean;
}

export const ResponsiveCalendarDay: React.FC<ResponsiveCalendarDayProps> = ({
  day,
  dayBookings,
  user,
  timeSlots,
  isBooking,
  isCanceling,
  onBookSlot,
  onCancelBooking,
  isMobile = false
}) => {
  const { confirm } = useConfirm();

  const isAvailable = isFriday(day) && !isBefore(day, startOfDay(new Date()));

  const handleSlotClick = async (timeSlot: string) => {
    if (!isAvailable || isBooking) return;

    const shouldBook = await confirm({
      title: 'Confirmer la réservation',
      message: `Voulez-vous réserver le créneau ${timeSlot} pour le ${format(day, 'dd/MM/yyyy')} ?`,
      confirmText: 'Réserver',
      cancelText: 'Annuler'
    });

    if (shouldBook) {
      onBookSlot(day, timeSlot);
    }
  };

  const handleCancelClick = async (booking: Booking) => {
    const shouldCancel = await confirm({
      title: 'Confirmer l\'annulation',
      message: 'Cette action est irréversible. Voulez-vous vraiment annuler cette réservation ?',
      confirmText: 'Annuler la réservation',
      cancelText: 'Conserver',
      variant: 'danger'
    });

    if (shouldCancel) {
      onCancelBooking(booking);
    }
  };

  if (!isFriday(day)) {
    return (
      <Card className={`calendar-day calendar-day-disabled ${isMobile ? 'mobile-day' : ''}`}>
        <CardHeader className="calendar-day-header">
          <CardTitle className="calendar-day-number">
            {format(day, 'd')}
          </CardTitle>
          <CardDescription className="calendar-day-name">
            {format(day, 'EEE', { locale: fr })}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card
      className={`calendar-day ${
        isToday(day) ? 'calendar-day-today' : ''
      } calendar-day-friday ${isMobile ? 'mobile-day' : ''}`}
    >
      <CardHeader className="calendar-day-header">
        <div className="day-info">
          <CardTitle className="calendar-day-number">
            {format(day, 'd')}
          </CardTitle>
          <CardDescription className="calendar-day-name">
            {format(day, 'EEE', { locale: fr })}
          </CardDescription>
        </div>
        {isToday(day) && (
          <div className="today-indicator">
            <span className="today-dot"></span>
            Aujourd'hui
          </div>
        )}
      </CardHeader>

      <CardContent className="calendar-day-content">
        {!isAvailable && (
          <div className="unavailable-message">
            <AlertCircle size={16} />
            <span>Passé</span>
          </div>
        )}

        <div className={`time-slots-grid ${isMobile ? 'mobile-slots' : ''}`}>
          {timeSlots.map((slot) => {
            const booking = dayBookings.find(b => b.time_slot === slot.id);
            const isUserBooking = booking?.user_id === user?.id;
            const isBooked = !!booking;
            const canBook = isAvailable && !isBooked && user;
            const canCancel = isUserBooking && !isBefore(day, startOfDay(new Date()));

            return (
              <div key={slot.id} className="time-slot-container">
                {isMobile ? (
                  // Version mobile : layout vertical
                  <div className="mobile-slot-card">
                    <div className="mobile-slot-header">
                      <div className="mobile-slot-time">
                        <Clock size={14} />
                        {slot.label}
                      </div>
                      {isBooked && (
                        <div className="mobile-slot-status">
                          {isUserBooking ? (
                            <span className="user-booking">Votre réservation</span>
                          ) : (
                            <span className="other-booking">
                              <Car size={14} />
                              Réservé
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mobile-slot-actions">
                      {canBook && (
                        <Button
                          onClick={() => handleSlotClick(slot.id)}
                          disabled={isBooking}
                          size="sm"
                          className="mobile-book-button"
                        >
                          {isBooking ? (
                            <Spinner size="sm" text="Réservation..." />
                          ) : (
                            'Réserver'
                          )}
                        </Button>
                      )}

                      {canCancel && booking && (
                        <Button
                          onClick={() => handleCancelClick(booking)}
                          disabled={isCanceling === booking.id}
                          variant="outline"
                          size="sm"
                          className="mobile-cancel-button"
                        >
                          {isCanceling === booking.id ? (
                            <Spinner size="sm" text="Annulation..." />
                          ) : (
                            <>
                              <Trash2 size={14} />
                              Annuler
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  // Version desktop : layout compact
                  <Button
                    onClick={() => {
                      if (canBook) {
                        handleSlotClick(slot.id);
                      } else if (canCancel && booking) {
                        handleCancelClick(booking);
                      }
                    }}
                    disabled={!canBook && !canCancel}
                    variant={isUserBooking ? 'outline' : isBooked ? 'secondary' : 'default'}
                    size="sm"
                    className={`time-slot-button ${isBooked ? 'booked' : 'available'} ${isUserBooking ? 'user-booking' : ''}`}
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
                    </div>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
