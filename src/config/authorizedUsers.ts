// Configuration des utilisateurs autorisés pour l'application VIP Auto Wash Club
// Membres du CODIR avec accès complet + utilisateurs en visualisation seule

export interface AuthorizedUser {
  id: string;
  name: string;
  email: string;
  role: 'ceo' | 'director' | 'viewer';
  title: string;
  canBook: boolean;
  canViewAll: boolean;
}

export const authorizedUsers: AuthorizedUser[] = [
  // MEMBRES DU CODIR - Accès complet
  {
    id: 'dorsaf-ceo',
    name: 'Dorsaf',
    email: 'dorsaf@company.com',
    role: 'ceo',
    title: 'CEO',
    canBook: true,
    canViewAll: true
  },
  {
    id: 'najla-daf',
    name: 'Najla',
    email: 'najla@company.com',
    role: 'director',
    title: 'DAF (Directeur Administratif et Financier)',
    canBook: true,
    canViewAll: true
  },
  {
    id: 'souheil-drh',
    name: 'Souheil',
    email: 'souheil@company.com',
    role: 'director',
    title: 'DRH (Directeur Ressources Humaines)',
    canBook: true,
    canViewAll: true
  },
  {
    id: 'rym-perf',
    name: 'Rym',
    email: 'rym@company.com',
    role: 'director',
    title: 'Directeur Performance et Qualité',
    canBook: true,
    canViewAll: true
  },
  {
    id: 'achraf-dsi',
    name: 'Achraf',
    email: 'achraf@company.com',
    role: 'director',
    title: 'DSI (Directeur Système Information)',
    canBook: true,
    canViewAll: true
  },
  {
    id: 'mohamed-ops',
    name: 'Mohamed',
    email: 'mohamed@company.com',
    role: 'director',
    title: 'Directeur Opérationnel',
    canBook: true,
    canViewAll: true
  },
  {
    id: 'zeineb-ops',
    name: 'Zeineb',
    email: 'zeineb@company.com',
    role: 'director',
    title: 'Directeur Opérationnel',
    canBook: true,
    canViewAll: true
  },
  {
    id: 'boubaker-ops',
    name: 'Boubaker',
    email: 'boubaker@company.com',
    role: 'director',
    title: 'Directeur Opérationnel',
    canBook: true,
    canViewAll: true
  },
  {
    id: 'amine-ops',
    name: 'Amine',
    email: 'amine@company.com',
    role: 'director',
    title: 'Directeur Opérationnel',
    canBook: true,
    canViewAll: true
  },
  {
    id: 'ammar-ops',
    name: 'Ammar',
    email: 'ammar@company.com',
    role: 'director',
    title: 'Directeur Opérationnel',
    canBook: true,
    canViewAll: true
  },
  {
    id: 'aymen-ops',
    name: 'Aymen',
    email: 'aymen@company.com',
    role: 'director',
    title: 'Directeur Opérationnel',
    canBook: true,
    canViewAll: true
  },
  
  // ACCÈS VISUALISATION SEULE
  {
    id: 'marouane-viewer',
    name: 'Marouane',
    email: 'marouane@company.com',
    role: 'viewer',
    title: 'Visualisation Planning',
    canBook: false,
    canViewAll: true
  },
  {
    id: 'bechir-viewer',
    name: 'Bechir',
    email: 'bechir@company.com',
    role: 'viewer',
    title: 'Visualisation Planning',
    canBook: false,
    canViewAll: true
  }
];

// Fonction pour vérifier si un utilisateur est autorisé
export const isUserAuthorized = (email: string): AuthorizedUser | null => {
  return authorizedUsers.find(user => 
    user.email.toLowerCase() === email.toLowerCase()
  ) || null;
};

// Fonction pour obtenir un utilisateur par ID
export const getUserById = (id: string): AuthorizedUser | null => {
  return authorizedUsers.find(user => user.id === id) || null;
};

// Fonction pour obtenir tous les utilisateurs par rôle
export const getUsersByRole = (role: 'ceo' | 'director' | 'viewer'): AuthorizedUser[] => {
  return authorizedUsers.filter(user => user.role === role);
};

// Statistiques pour l'admin
export const getUserStats = () => {
  return {
    total: authorizedUsers.length,
    ceo: getUsersByRole('ceo').length,
    directors: getUsersByRole('director').length,
    viewers: getUsersByRole('viewer').length,
    canBook: authorizedUsers.filter(u => u.canBook).length,
    viewOnly: authorizedUsers.filter(u => !u.canBook).length
  };
};
