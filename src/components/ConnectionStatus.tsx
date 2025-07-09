import React from 'react';
import { config, logConfig } from '../config/app';
import { testSupabaseConnection, type SupabaseTestResult } from '../utils/supabaseTest';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, AlertCircle, Database, Settings, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  showDetails?: boolean;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  showDetails = false,
  className = ''
}) => {
  const [testResult, setTestResult] = React.useState<SupabaseTestResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    logConfig();
    // Test initial seulement si Supabase est configuré
    if (config.hasSupabase) {
      runConnectionTest();
    }
  }, []);

  const runConnectionTest = async () => {
    setIsLoading(true);
    try {
      const result = await testSupabaseConnection();
      setTestResult(result);
    } catch (error) {
      console.error('Erreur lors du test de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) {
      return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    
    if (config.hasSupabase && testResult?.connectionTest) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    if (config.hasSupabase && testResult && !testResult.connectionTest) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    
    return <AlertCircle className="w-4 h-4 text-yellow-500" />;
  };

  const getStatusText = () => {
    if (isLoading) {
      return 'Test en cours...';
    }
    
    if (config.hasSupabase && testResult?.connectionTest) {
      return 'Connecté à Supabase';
    }
    
    if (config.hasSupabase && testResult && !testResult.connectionTest) {
      return 'Erreur de connexion';
    }
    
    return 'Mode développement';
  };

  const getStatusColor = () => {
    if (isLoading) {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    
    if (config.hasSupabase && testResult?.connectionTest) {
      return 'bg-green-100 text-green-800 border-green-300';
    }
    
    if (config.hasSupabase && testResult && !testResult.connectionTest) {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  };

  return (
    <div className={`p-4 rounded-lg border ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          <h3 className="font-semibold">État de la connexion</h3>
        </div>
        
        {config.hasSupabase && (
          <button
            onClick={runConnectionTest}
            disabled={isLoading}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
            title="Tester la connexion"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-2 mb-3">
        {getStatusIcon()}
        <Badge className={getStatusColor()}>
          {getStatusText()}
        </Badge>
      </div>

      {showDetails && (
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>Configuration détaillée :</span>
          </div>
          
          <div className="pl-6 space-y-1">
            <div className="flex items-center gap-2">
              {config.supabaseUrl ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <XCircle className="w-3 h-3 text-red-500" />
              )}
              <span>URL Supabase : {config.supabaseUrl || 'Non définie'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {config.supabaseAnonKey ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : (
                <XCircle className="w-3 h-3 text-red-500" />
              )}
              <span>Clé anonyme : {config.supabaseAnonKey ? 'Définie' : 'Non définie'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3 h-3 text-blue-500" />
              <span>Mode : {config.isProduction ? 'Production' : 'Développement'}</span>
            </div>
          </div>
          
          {testResult && testResult.error && (
            <div className="mt-3 p-3 bg-red-50 rounded text-red-700 border border-red-200">
              <p className="text-sm">
                <strong>Erreur de connexion :</strong> {testResult.error}
              </p>
            </div>
          )}
          
          {!config.hasSupabase && (
            <div className="mt-3 p-3 bg-blue-50 rounded text-blue-700 border border-blue-200">
              <p className="text-sm">
                <strong>Mode développement actif :</strong> L'application utilise des données de test.
                Pour utiliser Supabase, configurez les variables d'environnement VITE_SUPABASE_URL 
                et VITE_SUPABASE_ANON_KEY.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
