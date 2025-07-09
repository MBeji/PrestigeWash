import React from 'react';
import { getAppMode, config, logConfig } from '../config/app';

// Import conditionnel des contextes
import { DataProvider as DevelopmentDataProvider, useData as useDevData } from './DataContext-dev';

interface SmartDataProviderProps {
  children: React.ReactNode;
}

export const SmartDataProvider: React.FC<SmartDataProviderProps> = ({ children }) => {
  const [appMode] = React.useState(() => {
    console.log('🔧 [SMART] Détection du mode d\'application...');
    logConfig();
    
    if (!config.hasSupabase) {
      console.log('🔧 [SMART] Supabase non configuré - Mode développement forcé');
      return 'development';
    }
    
    const mode = getAppMode();
    console.log('🔧 [SMART] Mode sélectionné:', mode);
    return mode;
  });
  
  React.useEffect(() => {
    console.log(`🔧 [SMART] DataProvider Mode actuel: ${appMode}`);
    console.log('🔧 [SMART] Supabase configuré:', config.hasSupabase);
  }, [appMode]);

  // Utiliser le bon provider selon la configuration
  if (config.hasSupabase) {
    console.log('🗄️ [SMART] Tentative d\'utilisation de Supabase...');
    
    // Import dynamique de Supabase seulement si configuré
    try {
      // Pour l'instant, on utilise toujours le mode dev pour éviter les erreurs
      // TODO: Implémenter l'import conditionnel de DataContext quand stable
      console.log('⚠️ [SMART] Supabase détecté mais utilisation du mode dev pour stabilité');
      return <DevelopmentDataProvider>{children}</DevelopmentDataProvider>;
    } catch (error) {
      console.error('❌ [SMART] Erreur lors du chargement de Supabase:', error);
      console.log('🔄 [SMART] Fallback vers le mode développement');
      return <DevelopmentDataProvider>{children}</DevelopmentDataProvider>;
    }
  }
  
  console.log('🧪 [SMART] Utilisation du DataContext de développement');
  return <DevelopmentDataProvider>{children}</DevelopmentDataProvider>;
};

// Hook unifié pour utiliser les données
export const useSmartData = () => {
  // Pour l'instant, toujours utiliser les données de développement
  console.log('🧪 [SMART] Utilisation des données de développement');
  return useDevData();
};

// Export des types pour compatibilité
export type { Booking, User } from './DataContext-dev';
