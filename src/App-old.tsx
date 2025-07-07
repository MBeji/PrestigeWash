import React, { useState, useEffect } from 'react';
import { Calendar, Users, Settings, Car, Crown, Eye, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { Calendar as CalendarComponent } from './components/Calendar';
import { UserSelector } from './components/UserSelector';
import { supabase } from './lib/supabase';
import { type AuthorizedUser, isUserAuthorized, getUserStats } from './config/authorizedUsers';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ceo' | 'director' | 'viewer';
  title: string;
  canBook: boolean;
  canViewAll: boolean;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('calendar');
  const [showUserSelector, setShowUserSelector] = useState(false);

  useEffect(() => {
    // En mode développement, afficher le sélecteur d'utilisateurs
    if (import.meta.env.DEV) {
      return;
    }

    // Check current session (pour la production avec Supabase)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const authorizedUser = isUserAuthorized(session.user.email || '');
        if (authorizedUser) {
          setUser({
            id: authorizedUser.id,
            email: authorizedUser.email,
            name: authorizedUser.name,
            role: authorizedUser.role,
            title: authorizedUser.title,
            canBook: authorizedUser.canBook,
            canViewAll: authorizedUser.canViewAll
          });
        } else {
          // Utilisateur non autorisé
          alert('❌ Accès refusé : Vous n\'êtes pas autorisé à accéder à cette application VIP.');
          supabase.auth.signOut();
        }
      }
    });

    // Listen for auth changes (pour la production)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const authorizedUser = isUserAuthorized(session.user.email || '');
        if (authorizedUser) {
          setUser({
            id: authorizedUser.id,
            email: authorizedUser.email,
            name: authorizedUser.name,
            role: authorizedUser.role,
            title: authorizedUser.title,
            canBook: authorizedUser.canBook,
            canViewAll: authorizedUser.canViewAll
          });
        } else {
          alert('❌ Accès refusé : Vous n\'êtes pas autorisé à accéder à cette application VIP.');
          supabase.auth.signOut();
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSelection = (authorizedUser: AuthorizedUser) => {
    setUser({
      id: authorizedUser.id,
      email: authorizedUser.email,
      name: authorizedUser.name,
      role: authorizedUser.role,
      title: authorizedUser.title,
      canBook: authorizedUser.canBook,
      canViewAll: authorizedUser.canViewAll
    });
  };

  const signIn = async () => {
    if (import.meta.env.DEV) {
      // En mode développement, ne rien faire ici car on utilise le sélecteur
      return;
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) console.error('Error signing in:', error);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
  };

  const CalendarView = () => {
    if (!user?.canBook) {
      return (
        <div className="space-y-6">
          <div className="viewer-header">
            <h2 className="text-3xl font-bold">Calendrier des Réservations</h2>
            <div className="viewer-badge">
              <Eye style={{ height: '16px', width: '16px', marginRight: '4px' }} />
              Mode visualisation seule
            </div>
          </div>
          <CalendarComponent 
            user={user!} 
            onBookingCreate={(date, timeSlot) => {
              console.log('Visualisation:', { date, timeSlot, user: user?.name });
            }}
          />
        </div>
      );
    }

    return (
      <CalendarComponent 
        user={user!} 
        onBookingCreate={(date, timeSlot) => {
          console.log('Nouvelle réservation:', { date, timeSlot, user: user?.name, role: user?.role });
          // Ici vous pourrez ajouter la logique pour sauvegarder en base
        }}
      />
    );
  };

  const DirectorsView = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Gestion des Directeurs</h2>
      <Card>
        <CardHeader>
          <CardTitle>Liste des Directeurs</CardTitle>
          <CardDescription>
            Gérer les permissions et les rôles des directeurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted">Fonctionnalité en développement...</p>
        </CardContent>
      </Card>
    </div>
  );

  const AdminView = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Administration</h2>
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du Système</CardTitle>
          <CardDescription>
            Configuration globale de l'application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted">Fonctionnalité en développement...</p>
        </CardContent>
      </Card>
    </div>
  );

  if (!user) {
    // Mode développement : afficher le sélecteur d'utilisateurs VIP
    if (import.meta.env.DEV) {
      return <UserSelector onUserSelect={handleUserSelection} />;
    }

    // Mode production : écran de connexion Google OAuth
    return (
      <div className="auth-container">
        <Card className="auth-card">
          <CardHeader style={{ textAlign: 'center' }}>
            <CardTitle className="logo-container" style={{ justifyContent: 'center' }}>
              <Car style={{ height: '24px', width: '24px' }} />
              Auto Wash Club VIP
            </CardTitle>
            <CardDescription>
              Application réservée aux membres du CODIR et utilisateurs autorisés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={signIn} className="w-full">
              Se connecter avec Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ceo': return <Crown style={{ height: '16px', width: '16px', color: '#f59e0b' }} />;
      case 'director': return <Users style={{ height: '16px', width: '16px', color: '#3b82f6' }} />;
      case 'viewer': return <Eye style={{ height: '16px', width: '16px', color: '#6b7280' }} />;
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

  return (
    <div className="main-layout">
      <header className="border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="logo-container">
              <Car style={{ height: '24px', width: '24px' }} />
              <h1 className="text-xl font-semibold">Auto Wash Club VIP</h1>
            </div>
            <div className="user-info">
              <div className="user-details">
                <div className="user-name-role">
                  <span className="user-name">{user.name}</span>
                  <div className="user-role-badge">
                    {getRoleIcon(user.role)}
                    <span>{getRoleLabel(user.role)}</span>
                  </div>
                </div>
                <div className="user-title">{user.title}</div>
              </div>
              <Button variant="outline" onClick={signOut}>
                <LogOut style={{ height: '16px', width: '16px', marginRight: '4px' }} />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex gap-8">
          <nav className="sidebar">
            <Button
              variant={activeTab === 'calendar' ? 'default' : 'ghost'}
              className="sidebar-button"
              onClick={() => setActiveTab('calendar')}
            >
              <Calendar style={{ height: '16px', width: '16px', marginRight: '8px' }} />
              Calendrier
            </Button>
            
            {user.canViewAll && (
              <Button
                variant={activeTab === 'directors' ? 'default' : 'ghost'}
                className="sidebar-button"
                onClick={() => setActiveTab('directors')}
              >
                <Users style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                Gestion Équipe
              </Button>
            )}
            
            {(user.role === 'ceo' || user.role === 'director') && (
              <Button
                variant={activeTab === 'admin' ? 'default' : 'ghost'}
                className="sidebar-button"
                onClick={() => setActiveTab('admin')}
              >
                <Settings style={{ height: '16px', width: '16px', marginRight: '8px' }} />
                Administration
              </Button>
            )}
            
            {!user.canBook && (
              <div className="viewer-notice">
                <Eye style={{ height: '16px', width: '16px' }} />
                <span>Mode visualisation seule</span>
              </div>
            )}
          </nav>

          <main className="main-content">
            {activeTab === 'calendar' && <CalendarView />}
            {activeTab === 'directors' && user.canViewAll && <DirectorsView />}
            {activeTab === 'admin' && (user.role === 'ceo' || user.role === 'director') && <AdminView />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
