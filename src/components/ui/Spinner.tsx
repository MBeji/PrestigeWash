import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
  text
}) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const classes = [
    'spinner',
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  if (text) {
    return (
      <div className={`${classes} spinner-with-text`}>
        <Loader2 
          className="spinner-icon" 
          size={iconSizes[size]}
        />
        <span className="spinner-text">{text}</span>
      </div>
    );
  }

  return (
    <Loader2 
      className={`${classes} spinner-icon`} 
      size={iconSizes[size]}
    />
  );
};
