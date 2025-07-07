import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { MobileCalendar } from './Calendar/MobileCalendar';
import { DesktopCalendar } from './Calendar/DesktopCalendar';

interface CalendarProps {
  user: any;
  onBookingCreate?: (date: string, timeSlot: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ user, onBookingCreate }) => {
  const { isMobile } = useResponsive();

  // Si mobile/tablet, utiliser le composant mobile optimisé
  if (isMobile) {
    return <MobileCalendar user={user} onBookingCreate={onBookingCreate} />;
  }

  // Version desktop
  return <DesktopCalendar user={user} onBookingCreate={onBookingCreate} />;
};
