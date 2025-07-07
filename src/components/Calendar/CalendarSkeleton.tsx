import React, { useState, useEffect } from 'react';
import { Skeleton } from '../ui/Skeleton';
import { LoadingProgress } from '../ui/LoadingProgress';
import { Card, CardContent, CardHeader } from '../ui/Card';

const loadingSteps = [
  'Connexion à la base de données',
  'Chargement des réservations',
  'Calcul des créneaux disponibles',
  'Finalisation'
];

export const CalendarSkeleton: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="calendar-container">
      {/* Loading Progress */}
      <Card className="loading-progress-card">
        <CardContent>
          <LoadingProgress 
            steps={loadingSteps}
            currentStep={currentStep}
          />
        </CardContent>
      </Card>

      {/* Header skeleton */}
      <Card className="calendar-header">
        <CardHeader>
          <div className="calendar-header-skeleton">
            <Skeleton width={40} height={40} variant="circular" />
            <Skeleton width={200} height={32} variant="text" />
            <Skeleton width={40} height={40} variant="circular" />
          </div>
        </CardHeader>
      </Card>

      {/* Calendar grid skeleton */}
      <Card className="calendar-grid">
        <CardContent>
          {/* Days of week */}
          <div className="calendar-days-header">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton 
                key={index} 
                width="100%" 
                height={20} 
                variant="text" 
                className="calendar-day-header-skeleton"
              />
            ))}
          </div>

          {/* Calendar days grid */}
          <div className="calendar-days-grid">
            {Array.from({ length: 35 }).map((_, index) => (
              <div key={index} className="calendar-day-skeleton">
                <Skeleton width={32} height={32} variant="rectangular" />
                {/* Randomly show some booking skeletons */}
                {Math.random() > 0.8 && (
                  <div className="calendar-day-bookings-skeleton">
                    <Skeleton width="90%" height={12} variant="rectangular" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* My bookings section skeleton */}
      <Card className="my-bookings-skeleton">
        <CardHeader>
          <Skeleton width={180} height={24} variant="text" />
        </CardHeader>
        <CardContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="booking-card-skeleton">
              <div className="booking-info-skeleton">
                <Skeleton width={120} height={16} variant="text" />
                <Skeleton width={80} height={14} variant="text" />
              </div>
              <Skeleton width={80} height={32} variant="rectangular" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
