import React from 'react';

interface LoadingProgressProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  steps,
  currentStep,
  className = ''
}) => {
  return (
    <div className={`loading-progress ${className}`}>
      <div className="loading-progress-bar">
        <div 
          className="loading-progress-fill" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
      
      <div className="loading-progress-steps">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`loading-progress-step ${
              index <= currentStep ? 'completed' : ''
            } ${index === currentStep ? 'active' : ''}`}
          >
            <div className="loading-progress-step-indicator">
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span className="loading-progress-step-label">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
