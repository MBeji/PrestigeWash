import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List } from 'lucide-react';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  addMonths,
  subMonths,
  isFriday
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { ResponsiveCalendarDay } from './ResponsiveCalendarDay';
import { CalendarSkeleton } from './CalendarSkeleton';
import { useResponsive } from '../../hooks/useResponsive';
import { useData, type Booking } from '../../contexts/DataContext-dev';

interface MobileCalendarProps {
  user: any;
  onBookingCreate?: (date: string, timeSlot: string) => void;
}

type ViewType = 'current' | 'history';

const timeSlots = [
  { id: '08:00-10:00', label: '08:00 - 10:00', start: '08:00', end: '10:00' },
  { id: '10:00-12:00', label: '10:00 - 12:00', start: '10:00', end: '12:00' },
  { id: '14:00-16:00', label: '14:00 - 16:00', start: '14:00', end: '16:00' }
];

export const MobileCalendar: React.FC<MobileCalendarProps> = ({ user, onBookingCreate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('current');
  const [isBooking, setIsBooking] = useState(false);
  const [isCanceling, setIsCanceling] = useState<string | null>(null);

  const { isMobile } = useResponsive();
    const {
    bookingsLoading,
    createBooking,
    cancelBooking,
    getFutureBookings,
    getBookingsForDate,
  } = useData();

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' 
      ? subMonths(currentDate, 1) 
      : addMonths(currentDate, 1)
    );
  };

  const handleBookSlot = async (date: Date, timeSlot: string) => {
    if (!user?.id || isBooking) return;

    setIsBooking(true);
    try {      await createBooking(user.id, date, timeSlot);
      onBookingCreate?.(format(date, 'yyyy-MM-dd'), timeSlot);
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelBooking = async (booking: Booking) => {
    setIsCanceling(booking.id);
    try {
      await cancelBooking(booking.id);
    } finally {
      setIsCanceling(null);
    }
  };

  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  };

  const getFridaysInMonth = () => {
    return getDaysInMonth().filter(day => isFriday(day));
  };

  const userFutureBookings = user?.id ? getFutureBookings(user.id) : [];

  if (bookingsLoading) {
    return <CalendarSkeleton />;
  }
  const renderViewSelector = () => (
    <div className="mobile-view-selector">
      <div className="view-type-buttons">
        <Button
          variant={viewType === 'current' ? 'default' : 'outline'}
          onClick={() => setViewType('current')}
          size="sm"
          className="view-button"
        >
          <CalendarIcon size={16} />
          {!isMobile && 'Calendrier'}
        </Button>
        <Button
          variant={viewType === 'history' ? 'default' : 'outline'}
          onClick={() => setViewType('history')}
          size="sm"
          className="view-button"
        >
          <List size={16} />
          {!isMobile && 'Mes réservations'}
        </Button>
      </div>
    </div>
  );

  const renderCalendarHeader = () => (
    <Card className="mobile-calendar-header">
      <CardHeader>
        <div className="mobile-header-nav">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigateMonth('prev')}
            className="nav-button"
          >
            <ChevronLeft size={16} />
          </Button>
          
          <CardTitle className="month-title">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </CardTitle>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigateMonth('next')}
            className="nav-button"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );

  const renderFutureBookings = () => (
    <div className="future-bookings-mobile">
      {userFutureBookings.length === 0 ? (
        <Card className="no-bookings-card">
          <CardContent>
            <div className="no-bookings-content">
              <CalendarIcon size={48} />
              <h3>Aucune réservation future</h3>
              <p>Vous n'avez pas encore de réservations programmées.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="bookings-list">
          {userFutureBookings.map((booking) => (
            <Card key={booking.id} className="future-booking-mobile">
              <CardContent>
                <div className="booking-info">
                  <div className="booking-date">
                    <div className="date-day">
                      {format(new Date(booking.date), 'd')}
                    </div>
                    <div className="date-details">
                      <div className="date-month">
                        {format(new Date(booking.date), 'MMM', { locale: fr })}
                      </div>
                      <div className="date-year">
                        {format(new Date(booking.date), 'yyyy')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="booking-details">
                    <div className="booking-time">
                      {booking.time_slot}
                    </div>
                    <div className="booking-day">
                      {format(new Date(booking.date), 'EEEE', { locale: fr })}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleCancelBooking(booking)}
                    disabled={isCanceling === booking.id}
                    variant="outline"
                    size="sm"
                    className="cancel-button-mobile"
                  >
                    {isCanceling === booking.id ? '...' : '✕'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderCalendarGrid = () => {
    const fridays = getFridaysInMonth();
      return (
      <div className={`calendar-container-mobile`}>
        <div className="fridays-list">
          {fridays.map((day) => {
            const dayBookings = getBookingsForDate(day);
            return (
              <ResponsiveCalendarDay
                key={day.toISOString()}
                day={day}
                dayBookings={dayBookings}
                user={user}
                timeSlots={timeSlots}
                isBooking={isBooking}
                isCanceling={isCanceling}
                onBookSlot={handleBookSlot}
                onCancelBooking={handleCancelBooking}
                isMobile={true}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mobile-calendar-wrapper">
      {renderViewSelector()}
      
      {viewType !== 'history' && renderCalendarHeader()}
      
      <div className="mobile-calendar-content">
        {viewType === 'history' ? renderFutureBookings() : renderCalendarGrid()}
      </div>
      
      {/* Indicateur de swipe pour mobile */}
      {isMobile && viewType === 'current' && (
        <div className="swipe-hint">
          Glissez pour naviguer entre les mois
        </div>
      )}
    </div>
  );
};
