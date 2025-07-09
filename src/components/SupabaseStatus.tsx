import { useEffect, useState } from 'react'
import { 
  getSupabaseStatus, 
  testSupabaseConnection 
} from '../lib/supabase'

interface ConnectionStatus {
  isConfigured: boolean;
  isConnected: boolean;
  latency?: number;
  error?: string;
  lastCheck?: Date;
}

interface SupabaseStatusProps {
  className?: string;
}

export const SupabaseStatus: React.FC<SupabaseStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConfigured: false,
    isConnected: false
  });
  const [testing, setTesting] = useState(false);

  const checkConnection = async () => {
    setTesting(true);
    const config = getSupabaseStatus();
    
    if (!config.isConfigured) {
      setStatus({
        isConfigured: false,
        isConnected: false,
        error: 'Variables d\'environnement manquantes',
        lastCheck: new Date()
      });
      setTesting(false);
      return;
    }

    try {
      const result = await testSupabaseConnection();
      setStatus({
        isConfigured: true,
        isConnected: result.success,
        latency: result.latency,
        error: result.error,
        lastCheck: new Date()
      });
    } catch (error) {
      setStatus({
        isConfigured: true,
        isConnected: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        lastCheck: new Date()
      });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const getStatusColor = () => {
    if (testing) return 'text-yellow-600';
    if (!status.isConfigured) return 'text-gray-500';
    if (status.isConnected) return 'text-green-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (testing) return '🔄';
    if (!status.isConfigured) return '⚙️';
    if (status.isConnected) return '✅';
    return '❌';
  };

  const getStatusText = () => {
    if (testing) return 'Test en cours...';
    if (!status.isConfigured) return 'Non configuré';
    if (status.isConnected) return `Connecté ${status.latency ? `(${Math.round(status.latency)}ms)` : ''}`;
    return `Erreur: ${status.error}`;
  };
  return (
    <div className={`inline-flex items-center gap-2 text-sm ${className}`}>
      <span className={`${getStatusColor()} font-medium`}>
        {getStatusIcon()} Supabase: {getStatusText()}
      </span>
      
      {status.lastCheck && (
        <span className="text-gray-400 text-xs">
          ({status.lastCheck.toLocaleTimeString()})
        </span>
      )}
      
      {!testing && (
        <button
          onClick={checkConnection}
          className="ml-2 text-xs text-blue-500 hover:text-blue-700 underline"
        >
          Tester
        </button>
      )}
    </div>
  );
};

export default SupabaseStatus;
