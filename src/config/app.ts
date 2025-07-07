// Configuration d'environnement pour PrestigeWash
// Détecte automatiquement si Supabase est configuré ou utilise le mode dev

interface AppConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isProduction: boolean;
  isDevelopment: boolean;
  hasSupabase: boolean;
}

const getAppConfig = (): AppConfig => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const isProduction = import.meta.env.PROD;
  const isDevelopment = import.meta.env.DEV;
  
  // Vérifier si Supabase est correctement configuré
  const hasSupabase = supabaseUrl.includes('supabase.co') && 
                      supabaseAnonKey.length > 100;

  return {
    supabaseUrl,
    supabaseAnonKey,
    isProduction,
    isDevelopment,
    hasSupabase
  };
};

export const config = getAppConfig();

// Utilitaires pour le debug
export const logConfig = () => {
  console.log('🔧 Configuration PrestigeWash:');
  console.log('- Environnement:', config.isProduction ? 'Production' : 'Développement');
  console.log('- Supabase configuré:', config.hasSupabase ? '✅' : '❌');
  console.log('- URL Supabase:', config.supabaseUrl ? '✅' : '❌');
  console.log('- Clé Supabase:', config.supabaseAnonKey ? '✅' : '❌');
};

// Mode de fonctionnement
export const getAppMode = () => {
  if (config.hasSupabase) {
    return 'production'; // Mode complet avec Supabase
  }
  return 'development'; // Mode développement avec données mockées
};

export default config;
