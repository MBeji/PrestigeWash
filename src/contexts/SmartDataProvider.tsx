import React from 'react';
import { getAppMode } from '../config/app';

// Import direct des contextes
import { DataProvider as ProductionDataProvider } from './DataContext';
import { DataProvider as DevelopmentDataProvider } from './DataContext-dev';

interface SmartDataProviderProps {
  children: React.ReactNode;
}

export const SmartDataProvider: React.FC<SmartDataProviderProps> = ({ children }) => {
  const [appMode] = React.useState(() => getAppMode());
  
  React.useEffect(() => {
    console.log(`🔧 DataProvider Mode: ${appMode}`);
  }, [appMode]);

  if (appMode === 'production') {
    console.log('📊 Utilisation du DataContext Supabase (Production)');
    return <ProductionDataProvider>{children}</ProductionDataProvider>;
  }
  
  console.log('🧪 Utilisation du DataContext Mock (Développement)');
  return <DevelopmentDataProvider>{children}</DevelopmentDataProvider>;
};

// Hook unifié pour utiliser les données
export const useSmartData = () => {
  const [appMode] = React.useState(() => getAppMode());
  
  // Import dynamique du hook approprié
  if (appMode === 'production') {
    const { useData } = require('./DataContext');
    return useData();
  } else {
    const { useData } = require('./DataContext-dev');
    return useData();
  }
};

// Export des types pour compatibilité
export type { Booking, User } from './DataContext-dev';
