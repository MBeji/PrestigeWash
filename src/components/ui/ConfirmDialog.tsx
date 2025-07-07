import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'default',
  icon,
  isLoading = false
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="confirm-dialog-overlay" onClick={handleOverlayClick}>
      <div className="confirm-dialog">
        <Card className="confirm-dialog-card">
          <div className="confirm-dialog-header">
            <div className="confirm-dialog-title-row">
              <div className="confirm-dialog-icon">
                {icon || (variant === 'danger' ? <AlertTriangle className="icon-danger" /> : null)}
              </div>
              <h3 className="confirm-dialog-title">{title}</h3>
              <button 
                className="confirm-dialog-close"
                onClick={onClose}
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="confirm-dialog-content">
            <p className="confirm-dialog-message">{message}</p>
          </div>

          <div className="confirm-dialog-actions">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>            <Button
              variant={variant === 'danger' ? 'destructive' : 'default'}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Chargement...' : confirmText}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
