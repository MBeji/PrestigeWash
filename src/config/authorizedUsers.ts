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

// Interface étendue avec mot de passe pour l'authentification
export interface AuthorizedUserWithPassword extends AuthorizedUser {
  password: string | null; // null = première connexion requise
  lastLogin?: Date;
  loginAttempts?: number;
  lockedUntil?: Date;
  isFirstLogin?: boolean;
  temporaryPassword?: string; // Mot de passe temporaire pour la première connexion
}

// Configuration des mots de passe pour les utilisateurs autorisés
// Tous les utilisateurs (sauf admin) doivent définir leur mot de passe à la première connexion
export const userCredentials: AuthorizedUserWithPassword[] = [
  // MEMBRES DU CODIR - Accès complet
  {
    id: 'dorsaf-ceo',
    name: 'Dorsaf',
    email: 'dorsaf@company.com',
    role: 'ceo',
    title: 'CEO',
    canBook: true,
    canViewAll: true,
    password: null, // Première connexion requise
    isFirstLogin: true,
    temporaryPassword: 'Dorsaf2025!' // Mot de passe temporaire initial
  },
  {
    id: 'najla-daf',
    name: 'Najla',
    email: 'najla@company.com',
    role: 'director',
    title: 'DAF (Directeur Administratif et Financier)',
    canBook: true,
    canViewAll: true,
    password: null,
    isFirstLogin: true,
    temporaryPassword: 'Najla2025!'
  },
  {
    id: 'souheil-drh',
    name: 'Souheil',
    email: 'souheil@company.com',
    role: 'director',
    title: 'DRH (Directeur Ressources Humaines)',
    canBook: true,
    canViewAll: true,
    password: null,
    isFirstLogin: true,
    temporaryPassword: 'Souheil2025!'
  },
  {
    id: 'rym-perf',
    name: 'Rym',
    email: 'rym@company.com',
    role: 'director',
    title: 'Directeur Performance et Qualité',
    canBook: true,
    canViewAll: true,
    password: null,
    isFirstLogin: true,
    temporaryPassword: 'Rym2025!'
  },
  {
    id: 'achraf-dsi',
    name: 'Achraf',
    email: 'achraf@company.com',
    role: 'director',
    title: 'DSI (Directeur Système Information)',
    canBook: true,
    canViewAll: true,
    password: null,
    isFirstLogin: true,
    temporaryPassword: 'Achraf2025!'
  },
  {
    id: 'mohamed-ops',
    name: 'Mohamed',
    email: 'mohamed@company.com',
    role: 'director',
    title: 'Directeur Opérationnel',
    canBook: true,
    canViewAll: true,
    password: null,
    isFirstLogin: true,
    temporaryPassword: 'Mohamed2025!'
  },
  {
    id: 'zeineb-ops',
    name: 'Zeineb',
    email: 'zeineb@company.com',
    role: 'director',
    title: 'Directeur Opérationnel',
    canBook: true,
    canViewAll: true,
    password: null,
    isFirstLogin: true,
    temporaryPassword: 'Zeineb2025!'
  },
  {
    id: 'boubaker-ops',
    name: 'Boubaker',
    email: 'boubaker@company.com',
    role: 'director',
    title: 'Directeur Opérationnel',
    canBook: true,
    canViewAll: true,
    password: null,
    isFirstLogin: true,
    temporaryPassword: 'Boubaker2025!'
  },
  {
    id: 'amine-ops',
    name: 'Amine',
    email: 'amine@company.com',
    role: 'director',
    title: 'Directeur Opérationnel',
    canBook: true,
    canViewAll: true,
    password: null,
    isFirstLogin: true,
    temporaryPassword: 'Amine2025!'
  },
  {
    id: 'ammar-ops',
    name: 'Ammar',
    email: 'ammar@company.com',
    role: 'director',
    title: 'Directeur Opérationnel',
    canBook: true,
    canViewAll: true,
    password: null,
    isFirstLogin: true,
    temporaryPassword: 'Ammar2025!'
  },
  {
    id: 'aymen-ops',
    name: 'Aymen',
    email: 'aymen@company.com',
    role: 'director',
    title: 'Directeur Opérationnel',
    canBook: true,
    canViewAll: true,
    password: null,
    isFirstLogin: true,
    temporaryPassword: 'Aymen2025!'
  },
  // ACCÈS VISUALISATION SEULE
  {
    id: 'marouane-viewer',
    name: 'Marouane',
    email: 'marouane@company.com',
    role: 'viewer',
    title: 'Visualisation Planning',
    canBook: false,
    canViewAll: true,
    password: null,
    isFirstLogin: true,
    temporaryPassword: 'Marouane2025!'
  },
  {
    id: 'bechir-viewer',
    name: 'Bechir',
    email: 'bechir@company.com',
    role: 'viewer',
    title: 'Visualisation Planning',
    canBook: false,
    canViewAll: true,
    password: null,
    isFirstLogin: true,
    temporaryPassword: 'Bechir2025!'
  },
  {
    id: 'admin-system',
    name: 'Administrateur Système',
    email: 'admin@codir.com',
    role: 'ceo',
    title: 'Administrateur Système',
    canBook: true,
    canViewAll: true,
    password: 'AdminSystem2025!', // Admin garde son mot de passe par défaut
    isFirstLogin: false
  }
];

// Liste des utilisateurs autorisés (sans mots de passe pour l'API publique)
export const authorizedUsers: AuthorizedUser[] = userCredentials.map(user => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  title: user.title,
  canBook: user.canBook,
  canViewAll: user.canViewAll
}));

// Stockage temporaire des tentatives de connexion (en production, utiliser Redis ou base de données)
const loginAttempts = new Map<string, { count: number; lockedUntil: Date | null }>();

// Configuration de sécurité
const SECURITY_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 3,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes en millisecondes
  PASSWORD_MIN_LENGTH: 8
};

// Fonction pour vérifier si un utilisateur est verrouillé
export const isUserLocked = (email: string): boolean => {
  const attempts = loginAttempts.get(email);
  if (!attempts || !attempts.lockedUntil) return false;
  
  if (attempts.lockedUntil > new Date()) {
    return true;
  }
  
  // Déverrouiller si la période de verrouillage est expirée
  attempts.lockedUntil = null;
  attempts.count = 0;
  return false;
};

// Fonction pour obtenir le temps restant de verrouillage
export const getLockoutTimeRemaining = (email: string): number => {
  const attempts = loginAttempts.get(email);
  if (!attempts || !attempts.lockedUntil) return 0;
  
  const remaining = attempts.lockedUntil.getTime() - new Date().getTime();
  return Math.max(0, Math.ceil(remaining / 1000)); // Retourne en secondes
};

// Fonction pour enregistrer une tentative de connexion échouée
const recordFailedAttempt = (email: string): void => {
  const attempts = loginAttempts.get(email) || { count: 0, lockedUntil: null };
  attempts.count++;
  
  if (attempts.count >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
    attempts.lockedUntil = new Date(Date.now() + SECURITY_CONFIG.LOCKOUT_DURATION);
  }
  
  loginAttempts.set(email, attempts);
};

// Fonction pour réinitialiser les tentatives de connexion
const resetLoginAttempts = (email: string): void => {
  loginAttempts.delete(email);
};

// Fonction pour obtenir le nombre de tentatives restantes
export const getRemainingAttempts = (email: string): number => {
  const attempts = loginAttempts.get(email);
  if (!attempts) return SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS;
  return Math.max(0, SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - attempts.count);
};

// Fonction pour vérifier si un utilisateur doit définir son mot de passe (première connexion)
export const requiresPasswordSetup = (nameOrEmail: string): {
  required: boolean;
  user?: AuthorizedUserWithPassword;
  temporaryPassword?: string;
} => {
  const user = userCredentials.find(u => 
    u.name.toLowerCase() === nameOrEmail.toLowerCase() || 
    u.email.toLowerCase() === nameOrEmail.toLowerCase()
  );
  
  if (!user) {
    return { required: false };
  }
  
  if (user.isFirstLogin && user.password === null) {
    return { 
      required: true, 
      user, 
      temporaryPassword: user.temporaryPassword 
    };
  }
  
  return { required: false, user };
};

// Fonction pour définir le mot de passe lors de la première connexion
export const setInitialPassword = (nameOrEmail: string, temporaryPassword: string, newPassword: string): {
  success: boolean;
  error?: string;
} => {
  const user = userCredentials.find(u => 
    u.name.toLowerCase() === nameOrEmail.toLowerCase() || 
    u.email.toLowerCase() === nameOrEmail.toLowerCase()
  );
  
  if (!user) {
    return { success: false, error: 'Utilisateur non trouvé' };
  }
  
  if (!user.isFirstLogin || user.password !== null) {
    return { success: false, error: 'Utilisateur déjà initialisé' };
  }
  
  if (user.temporaryPassword !== temporaryPassword) {
    return { success: false, error: 'Mot de passe temporaire incorrect' };
  }
  
  if (newPassword.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    return { 
      success: false, 
      error: `Le mot de passe doit contenir au moins ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} caractères` 
    };
  }
  
  // Définir le nouveau mot de passe
  user.password = newPassword;
  user.isFirstLogin = false;
  user.temporaryPassword = undefined;
  user.lastLogin = new Date();
  
  // Réinitialiser les tentatives de connexion
  resetLoginAttempts(user.name);
  
  return { success: true };
};

// Fonction d'authentification par login/mot de passe (modifiée pour la première connexion)
export const authenticateUser = (email: string, password: string): {
  success: boolean;
  user?: AuthorizedUser;
  error?: string;
  remainingAttempts?: number;
  lockoutTime?: number;
  requiresPasswordSetup?: boolean;
} => {
  // Vérifier si l'utilisateur est verrouillé
  if (isUserLocked(email)) {
    return {
      success: false,
      error: 'Compte temporairement verrouillé',
      lockoutTime: getLockoutTimeRemaining(email)
    };
  }

  // Trouver l'utilisateur dans la liste des credentials
  const user = userCredentials.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    recordFailedAttempt(email);
    return {
      success: false,
      error: 'Utilisateur non autorisé',
      remainingAttempts: getRemainingAttempts(email)
    };
  }

  // Vérifier si l'utilisateur doit définir son mot de passe
  if (user.isFirstLogin && user.password === null) {
    return {
      success: false,
      error: 'Première connexion requise',
      requiresPasswordSetup: true
    };
  }

  // Vérifier le mot de passe
  if (user.password !== password) {
    recordFailedAttempt(email);
    return {
      success: false,
      error: 'Mot de passe incorrect',
      remainingAttempts: getRemainingAttempts(email)
    };
  }

  // Authentification réussie
  resetLoginAttempts(email);
  
  // Mettre à jour la date de dernière connexion
  user.lastLogin = new Date();
  
  // Retourner l'utilisateur sans le mot de passe
  const { password: _, temporaryPassword: __, ...userWithoutPassword } = user;
  return {
    success: true,
    user: userWithoutPassword
  };
};

// Fonction d'authentification par nom/mot de passe (nouvelle version)
export const authenticateUserByName = (name: string, password: string): {
  success: boolean;
  user?: AuthorizedUser;
  error?: string;
  remainingAttempts?: number;
  lockoutTime?: number;
  requiresPasswordSetup?: boolean;
} => {
  // Vérifier si l'utilisateur est verrouillé (utiliser le nom comme clé)
  if (isUserLocked(name)) {
    return {
      success: false,
      error: 'Compte temporairement verrouillé',
      lockoutTime: getLockoutTimeRemaining(name)
    };
  }

  // Trouver l'utilisateur dans la liste des credentials par nom
  const user = userCredentials.find(u => u.name.toLowerCase() === name.toLowerCase());
  
  if (!user) {
    return {
      success: false,
      error: 'Utilisateur non autorisé',
      remainingAttempts: 0
    };
  }

  // Vérifier si c'est la première connexion
  if (user.isFirstLogin || user.password === null) {
    // Vérifier le mot de passe temporaire
    if (user.temporaryPassword && user.temporaryPassword === password) {
      return {
        success: false,
        requiresPasswordSetup: true,
        user: user
      };
    } else {
      recordFailedAttempt(name);
      return {
        success: false,
        error: 'Mot de passe temporaire invalide',
        remainingAttempts: getRemainingAttempts(name)
      };
    }
  }
  // Authentification normale
  if (user.password === password) {
    // Réinitialiser les tentatives en cas de succès
    resetLoginAttempts(name);
    
    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    
    return {
      success: true,
      user: user
    };
  } else {
    // Enregistrer l'échec de connexion
    recordFailedAttempt(name);
    
    return {
      success: false,
      error: 'Mot de passe incorrect',
      remainingAttempts: getRemainingAttempts(name)
    };
  }
};

// Fonction pour changer le mot de passe d'un utilisateur (pour l'admin)
export const changeUserPassword = (userId: string, newPassword: string): {
  success: boolean;
  error?: string;
} => {
  if (newPassword.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    return {
      success: false,
      error: `Le mot de passe doit contenir au moins ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} caractères`
    };
  }

  const user = userCredentials.find(u => u.id === userId);
  if (!user) {
    return {
      success: false,
      error: 'Utilisateur non trouvé'
    };
  }

  user.password = newPassword;
  user.isFirstLogin = false;
  return { success: true };
};

// Fonction pour réinitialiser le mot de passe d'un utilisateur (pour l'admin)
export const resetUserPassword = (userId: string): {
  success: boolean;
  temporaryPassword?: string;
  error?: string;
} => {
  const user = userCredentials.find(u => u.id === userId);
  if (!user) {
    return {
      success: false,
      error: 'Utilisateur non trouvé'
    };
  }

  // Générer un mot de passe temporaire
  const temporaryPassword = `${user.name}${Math.random().toString(36).slice(2, 6)}!`;
  user.password = null;
  user.isFirstLogin = true;
  user.temporaryPassword = temporaryPassword;
  
  // Réinitialiser les tentatives de connexion
  resetLoginAttempts(user.email);
  
  return {
    success: true,
    temporaryPassword
  };
};

// Fonction pour débloquer un utilisateur (pour l'admin)
export const unlockUser = (email: string): boolean => {
  resetLoginAttempts(email);
  return true;
};

// Fonction pour obtenir les statistiques de sécurité
export const getSecurityStats = () => {
  const lockedUsers = Array.from(loginAttempts.entries())
    .filter(([_, attempts]) => attempts.lockedUntil && attempts.lockedUntil > new Date())
    .map(([email, attempts]) => ({
      email,
      lockedUntil: attempts.lockedUntil,
      remainingTime: getLockoutTimeRemaining(email)
    }));

  const firstLoginUsers = userCredentials.filter(user => user.isFirstLogin && user.password === null);

  return {
    totalUsers: userCredentials.length,
    lockedUsers: lockedUsers.length,
    lockedUsersList: lockedUsers,
    firstLoginUsers: firstLoginUsers.length,
    firstLoginUsersList: firstLoginUsers.map(user => ({ email: user.email, name: user.name })),
    maxAttempts: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS,
    lockoutDuration: SECURITY_CONFIG.LOCKOUT_DURATION / 1000 / 60 // en minutes
  };
};

// Fonction pour vérifier si un utilisateur est autorisé
export const isUserAuthorized = (email: string): AuthorizedUser | null => {
  return authorizedUsers.find(user => 
    user.email.toLowerCase() === email.toLowerCase()
  ) || null;
};

// Fonction pour vérifier si un utilisateur est autorisé par son nom
export const isUserAuthorizedByName = (name: string): AuthorizedUser | null => {
  return authorizedUsers.find(user => 
    user.name.toLowerCase() === name.toLowerCase()
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
