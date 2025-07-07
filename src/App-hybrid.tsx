import React from 'react';
import { logConfig, getAppMode } from './config/app';

// Import direct au lieu de lazy loading
import ProductionApp from './App-production';
import DevelopmentApp from './App-development';

const AppModeSelector: React.FC = () => {
  const [appMode] = React.useState(() => getAppMode());
  
  React.useEffect(() => {
    logConfig();
  }, []);

  return (
    <div className="app-container">
      {appMode === 'production' ? (
        <ProductionApp />
      ) : (
        <DevelopmentApp />
      )}
    </div>
  );
};

export default AppModeSelector;
