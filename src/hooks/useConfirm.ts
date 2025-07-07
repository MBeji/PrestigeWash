import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  icon?: React.ReactNode;
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: (() => void) | (() => Promise<void>);
  onCancel: () => void;
}

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const confirm = useCallback((
    options: ConfirmOptions
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const onConfirm = async () => {
        setConfirmState(prev => prev ? { ...prev, isLoading: true } : null);
        
        try {
          // Petite attente pour l'UX
          await new Promise(r => setTimeout(r, 200));
          resolve(true);
        } finally {
          setConfirmState(null);
        }
      };

      const onCancel = () => {
        setConfirmState(null);
        resolve(false);
      };

      setConfirmState({
        ...options,
        isOpen: true,
        isLoading: false,
        onConfirm,
        onCancel
      });
    });
  }, []);

  const closeDialog = useCallback(() => {
    if (confirmState && !confirmState.isLoading) {
      confirmState.onCancel();
    }
  }, [confirmState]);

  return {
    confirm,
    confirmState,
    closeDialog
  };
};
