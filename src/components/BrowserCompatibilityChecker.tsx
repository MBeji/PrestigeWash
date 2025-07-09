import { useEffect, useState } from 'react';

interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  supportsGrid: boolean;
  supportsFlex: boolean;
  supportsGap: boolean;
}

export const BrowserCompatibilityChecker = () => {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const detectBrowser = (): BrowserInfo => {
      const userAgent = navigator.userAgent;
      let name = 'Unknown';
      let version = 'Unknown';
      let engine = 'Unknown';

      // Détection du navigateur
      if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        name = 'Chrome';
        const match = userAgent.match(/Chrome\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'Blink';
      } else if (userAgent.includes('Firefox')) {
        name = 'Firefox';
        const match = userAgent.match(/Firefox\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'Gecko';
      } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        name = 'Safari';
        const match = userAgent.match(/Version\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'WebKit';
      } else if (userAgent.includes('Edg')) {
        name = 'Edge';
        const match = userAgent.match(/Edg\/(\d+)/);
        version = match ? match[1] : 'Unknown';
        engine = 'Blink';
      }      // Test des fonctionnalités CSS
      const supportsGrid = CSS.supports('display', 'grid');
      const supportsFlex = CSS.supports('display', 'flex');
      const supportsGap = CSS.supports('gap', '1rem');

      return {
        name,
        version,
        engine,
        supportsGrid,
        supportsFlex,
        supportsGap
      };
    };

    setBrowserInfo(detectBrowser());

    // Afficher automatiquement en mode développement
    if (import.meta.env.DEV) {
      setIsVisible(true);
      // Masquer après 10 secondes
      setTimeout(() => setIsVisible(false), 10000);
    }
  }, []);

  if (!browserInfo || !isVisible) return null;

  const hasIssues = !browserInfo.supportsGrid || !browserInfo.supportsFlex || !browserInfo.supportsGap;

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      background: hasIssues ? '#fff3cd' : '#d1ecf1',
      border: `1px solid ${hasIssues ? '#ffeaa7' : '#bee5eb'}`,
      borderRadius: '8px',
      padding: '1rem',
      maxWidth: '300px',
      fontSize: '0.875rem',
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '0.5rem'
      }}>
        <strong>🔍 Compatibilité</strong>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '0',
            color: '#666'
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>{browserInfo.name}</strong> {browserInfo.version} ({browserInfo.engine})
      </div>
      
      <div style={{ fontSize: '0.8rem' }}>
        <div>Grid: {browserInfo.supportsGrid ? '✅' : '❌'}</div>
        <div>Flexbox: {browserInfo.supportsFlex ? '✅' : '❌'}</div>
        <div>Gap: {browserInfo.supportsGap ? '✅' : '❌'}</div>
      </div>
      
      {hasIssues && (
        <div style={{ 
          marginTop: '0.5rem', 
          padding: '0.5rem', 
          background: '#f8d7da', 
          borderRadius: '4px',
          fontSize: '0.75rem'
        }}>
          ⚠️ Certaines fonctionnalités CSS modernes ne sont pas supportées.
        </div>
      )}
    </div>
  );
};
