import { config } from '../config/app';

export interface SupabaseTestResult {
  isConfigured: boolean;
  connectionTest: boolean;
  error?: string;
  details: {
    hasUrl: boolean;
    hasKey: boolean;
    urlValid: boolean;
    keyValid: boolean;
  };
}

export const testSupabaseConnection = async (): Promise<SupabaseTestResult> => {
  const result: SupabaseTestResult = {
    isConfigured: false,
    connectionTest: false,
    details: {
      hasUrl: !!config.supabaseUrl,
      hasKey: !!config.supabaseAnonKey,
      urlValid: false,
      keyValid: false
    }
  };

  // Vérifier si l'URL est valide
  if (config.supabaseUrl) {
    try {
      const url = new URL(config.supabaseUrl);
      result.details.urlValid = url.hostname.includes('supabase.co');
    } catch {
      result.details.urlValid = false;
    }
  }

  // Vérifier si la clé a une longueur raisonnable
  if (config.supabaseAnonKey) {
    result.details.keyValid = config.supabaseAnonKey.length > 100;
  }

  // Configuration de base vérifiée
  result.isConfigured = result.details.hasUrl && 
                       result.details.hasKey && 
                       result.details.urlValid && 
                       result.details.keyValid;

  // Test de connexion (seulement si configuré)
  if (result.isConfigured) {
    try {
      // Import dynamique pour éviter les erreurs si Supabase n'est pas configuré
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
        // Test simple avec timeout
      const { error } = await Promise.race([
        supabase.from('users').select('count').limit(1),
        new Promise<{ data: null; error: Error }>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]);

      if (error) {
        result.error = error.message;
        result.connectionTest = false;
      } else {
        result.connectionTest = true;
      }
    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Erreur inconnue';
      result.connectionTest = false;
    }
  }

  return result;
};

export const logSupabaseTest = async () => {
  console.log('🔍 Test de connexion Supabase...');
  
  const result = await testSupabaseConnection();
  
  console.log('📊 Résultats du test:');
  console.log('- Configuré:', result.isConfigured ? '✅' : '❌');
  console.log('- Connexion:', result.connectionTest ? '✅' : '❌');
  
  if (result.error) {
    console.log('- Erreur:', result.error);
  }
  
  console.log('📝 Détails:');
  console.log('  - URL présente:', result.details.hasUrl ? '✅' : '❌');
  console.log('  - Clé présente:', result.details.hasKey ? '✅' : '❌');
  console.log('  - URL valide:', result.details.urlValid ? '✅' : '❌');
  console.log('  - Clé valide:', result.details.keyValid ? '✅' : '❌');
  
  return result;
};
