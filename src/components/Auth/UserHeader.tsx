import React, { useState } from 'react';
import { LogOut, User, Shield, Crown } from 'lucide-react';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Spinner } from '../ui/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import { useConfirm } from '../../hooks/useConfirm';

export const UserHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { confirm, confirmState, closeDialog } = useConfirm();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;

  const getRoleIcon = () => {
    switch (user.role) {
      case 'ceo':
        return <Crown style={{ width: '16px', height: '16px', color: '#ffd700' }} />;
      case 'director':
        return <Shield style={{ width: '16px', height: '16px', color: '#3b82f6' }} />;
      case 'viewer':
        return <User style={{ width: '16px', height: '16px', color: '#6b7280' }} />;
      default:
        return <User style={{ width: '16px', height: '16px' }} />;
    }
  };

  const getRoleLabel = () => {
    switch (user.role) {
      case 'ceo':
        return 'CEO';
      case 'director':
        return 'Directeur';
      case 'viewer':
        return 'Visualisation';
      default:
        return 'Membre';
    }
  };  const handleLogout = async () => {
    const shouldLogout = await confirm({
      title: 'Confirmer la déconnexion',
      message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      confirmText: 'Se déconnecter',
      cancelText: 'Rester connecté',
      variant: 'default'
    });

    if (shouldLogout) {
      setIsLoggingOut(true);
      // Simuler un petit délai pour la déconnexion
      await new Promise(resolve => setTimeout(resolve, 500));
      logout();
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="user-header">
      <div className="user-info">
        <div className="user-avatar">
          {getRoleIcon()}
        </div>
        <div className="user-details">
          <div className="user-name">{user.name}</div>
          <div className="user-title">{user.title}</div>
          <div className={`user-role role-${user.role}`}>
            {getRoleLabel()}
            {user.canBook && <span className="can-book-badge">• Réservation</span>}
          </div>
        </div>
      </div>
      
      <div className="user-actions">        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="logout-button"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Spinner size="sm" text="Déconnexion..." />
          ) : (
            <>
              <LogOut style={{ width: '14px', height: '14px' }} />
              Déconnexion
            </>
          )}
        </Button></div>

      {/* Dialog de confirmation */}
      {confirmState && (
        <ConfirmDialog
          isOpen={confirmState.isOpen}
          onClose={closeDialog}
          onConfirm={confirmState.onConfirm}
          title={confirmState.title}
          message={confirmState.message}
          confirmText={confirmState.confirmText}
          cancelText={confirmState.cancelText}
          variant={confirmState.variant}
          icon={confirmState.icon}
          isLoading={confirmState.isLoading}
        />
      )}
    </div>
  );
};
