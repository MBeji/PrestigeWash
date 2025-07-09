import React from 'react';
import { getAppMode, config } from '../config/app';

// Import seulement du contexte de développement (toujours sûr)
import { DataProvider as DevelopmentDataProvider, useData as useDevData } from './DataContext-dev';

interface SmartDataProviderProps {
  children: React.ReactNode;
}

export const SmartDataProvider: React.FC<SmartDataProviderProps> = ({ children }) => {
  const [appMode] = React.useState(() => {
    console.log('🔧 [SMART] Détection du mode d\'application...');
    console.log('🔧 [SMART] Config Supabase:', {
      hasSupabase: config.hasSupabase,
      url: config.supabaseUrl ? 'Définie' : 'Non définie',
      key: config.supabaseAnonKey ? 'Définie' : 'Non définie'
    });
    
    // Forcer le mode développement si Supabase n'est pas configuré
    if (!config.hasSupabase) {
      console.log('🔧 [SMART] Supabase non configuré - Mode développement forcé');
      return 'development';
    }
    
    const mode = getAppMode();
    console.log('🔧 [SMART] Mode sélectionné:', mode);
    return mode;
  });
  
  React.useEffect(() => {
    console.log(`🔧 DataProvider Mode: ${appMode}`);
    console.log('🔧 Supabase configuré:', config.hasSupabase);
  }, [appMode]);
  // TOUJOURS utiliser le mode développement pour éviter les erreurs Supabase
  console.log('🧪 [SMART] Utilisation forcée du DataContext Mock (Développement)');
  return <DevelopmentDataProvider>{children}</DevelopmentDataProvider>;
};

// Hook unifié pour utiliser les données
export const useSmartData = () => {
  // TOUJOURS utiliser les données de développement
  console.log('🧪 [SMART] Utilisation forcée des données de développement');
  return useDevData();
};

// Export des types pour compatibilité
export type { Booking, User } from './DataContext-dev';
