import React, { useState } from 'react';
import { Crown, Eye, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { authorizedUsers, type AuthorizedUser } from '../config/authorizedUsers';

interface UserSelectorProps {
  onUserSelect: (user: AuthorizedUser) => void;
}

export const UserSelector: React.FC<UserSelectorProps> = ({ onUserSelect }) => {
  const [selectedRole, setSelectedRole] = useState<'all' | 'ceo' | 'director' | 'viewer'>('all');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ceo': return <Crown style={{ width: '16px', height: '16px', color: '#f59e0b' }} />;
      case 'director': return <Users style={{ width: '16px', height: '16px', color: '#3b82f6' }} />;
      case 'viewer': return <Eye style={{ width: '16px', height: '16px', color: '#6b7280' }} />;
      default: return null;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ceo': return 'CEO';
      case 'director': return 'Directeur';
      case 'viewer': return 'Visualisation';
      default: return role;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ceo': return 'role-badge-ceo';
      case 'director': return 'role-badge-director';
      case 'viewer': return 'role-badge-viewer';
      default: return '';
    }
  };

  const filteredUsers = selectedRole === 'all' 
    ? authorizedUsers 
    : authorizedUsers.filter(user => user.role === selectedRole);

  return (
    <div className="user-selector-container">
      <Card className="user-selector-card">
        <CardHeader style={{ textAlign: 'center' }}>
          <CardTitle className="flex items-center justify-center gap-2">
            <Crown style={{ height: '24px', width: '24px', color: '#f59e0b' }} />
            Auto Wash Club VIP
          </CardTitle>
          <CardDescription>
            Application réservée aux membres du CODIR et utilisateurs autorisés
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="user-selector-content">
            <div className="role-filters">
              <Button 
                variant={selectedRole === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRole('all')}
              >
                Tous ({authorizedUsers.length})
              </Button>
              <Button 
                variant={selectedRole === 'ceo' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRole('ceo')}
              >
                <Crown style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                CEO (1)
              </Button>
              <Button 
                variant={selectedRole === 'director' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRole('director')}
              >
                <Users style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                Directeurs (10)
              </Button>
              <Button 
                variant={selectedRole === 'viewer' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRole('viewer')}
              >
                <Eye style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                Visualisation (2)
              </Button>
            </div>

            <div className="users-grid">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="user-card"
                  onClick={() => onUserSelect(user)}
                >
                  <div className="user-header">
                    <div className="user-name">{user.name}</div>
                    <div className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {getRoleLabel(user.role)}
                    </div>
                  </div>
                  <div className="user-title">{user.title}</div>
                  <div className="user-permissions">
                    {user.canBook && <span className="permission-badge can-book">Peut réserver</span>}
                    {user.canViewAll && <span className="permission-badge can-view">Peut voir tout</span>}
                    {!user.canBook && <span className="permission-badge view-only">Visualisation seule</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="dev-note">
              <p>🔧 Mode développement : Sélectionnez un utilisateur pour tester l'application</p>
              <p>En production, l'authentification se fera via Google OAuth avec vérification d'autorisation.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
