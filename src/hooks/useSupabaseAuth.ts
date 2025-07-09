import { useState, useEffect } from 'react'
import { requireSupabase, withSupabase, type SupabaseUser } from '../lib/supabase'
import type { Session, User, AuthError } from '@supabase/supabase-js'
import { useToast } from '../contexts/ToastContext'
import { 
  authenticateUser, 
  authenticateUserByName,
  isUserLocked, 
  getLockoutTimeRemaining, 
  getRemainingAttempts,
  requiresPasswordSetup,
  setInitialPassword,
  type AuthorizedUser
} from '../config/authorizedUsers'

// Récupérer les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key'

interface AuthState {
  user: SupabaseUser | null
  session: Session | null
  loading: boolean
  error: AuthError | null
}

// Interface pour l'authentification locale
interface LocalAuthResult {
  success: boolean
  user?: SupabaseUser
  error?: string
  remainingAttempts?: number
  lockoutTime?: number
  requiresPasswordSetup?: boolean
}

// Interface pour la configuration du mot de passe initial
interface PasswordSetupResult {
  success: boolean
  error?: string
}

export const useSupabaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })
  const { showError, showSuccess } = useToast()
  
  // Convertir un AuthorizedUser en SupabaseUser
  const convertToSupabaseUser = (authorizedUser: AuthorizedUser): SupabaseUser => {
    return {
      id: authorizedUser.id,
      email: authorizedUser.email,
      name: authorizedUser.name,
      title: authorizedUser.title,
      role: authorizedUser.role,
      canBook: authorizedUser.canBook
    }
  }

  // Transformer un utilisateur Supabase en SupabaseUser
  const transformUser = async (supabaseUser: User): Promise<SupabaseUser | null> => {
    try {
      // Récupérer les données du profil utilisateur
      const client = requireSupabase()
      const { data: profile, error } = await client
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        title: profile.title,
        role: profile.role,
        canBook: profile.can_book
      }
    } catch (error) {
      console.error('Error transforming user:', error)
      return null
    }
  }

  // Écouter les changements d'authentification
  useEffect(() => {
    let mounted = true    // Récupérer la session actuelle
    const getSession = async () => {
      try {
        const client = requireSupabase()
        const { data: { session }, error } = await client.auth.getSession()
        
        if (error) {
          setAuthState(prev => ({ ...prev, error, loading: false }))
          return
        }

        if (session?.user && mounted) {
          const user = await transformUser(session.user)
          setAuthState({
            user,
            session,
            loading: false,
            error: null
          })
        } else {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            error: null
          })
        }
      } catch (error) {
        if (mounted) {
          setAuthState(prev => ({ 
            ...prev,            error: error as AuthError, 
            loading: false 
          }))
        }
      }
    }

    getSession()

    // Écouter les changements d'authentification
    const result = withSupabase(client => {
      const { data: { subscription } } = client.auth.onAuthStateChange(
        async (event: string, session: Session | null) => {
          if (!mounted) return

          if (session?.user) {
            const user = await transformUser(session.user)
            setAuthState({
              user,
              session,
              loading: false,
              error: null
            })

            if (event === 'SIGNED_IN') {
              showSuccess('Connexion réussie', `Bienvenue ${user?.name || 'Utilisateur'}`)
            }
          } else {
            setAuthState({
              user: null,
              session: null,
              loading: false,
              error: null
            })

            if (event === 'SIGNED_OUT') {
              showSuccess('Déconnexion réussie', 'À bientôt !')
            }
          }
        }
      )
      return () => {
        subscription.unsubscribe()
      }
    })

    return () => {
      mounted = false
      result?.()
    }
  }, [showError, showSuccess])
  // Connexion par email/mot de passe
  const signInWithPassword = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const client = requireSupabase()
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setAuthState(prev => ({ ...prev, error, loading: false }))
        showError('Erreur de connexion', error.message)
        return { success: false, error }
      }

      return { success: true, data }
    } catch (error) {
      const authError = error as AuthError
      setAuthState(prev => ({ ...prev, error: authError, loading: false }))
      showError('Erreur de connexion', authError.message)
      return { success: false, error: authError }
    }
  }

  // Inscription par email/mot de passe avec métadonnées
  const signUpWithPassword = async (
    email: string, 
    password: string, 
    metadata: { name: string; title: string }
  ) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const client = requireSupabase()
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: metadata.name,
            title: metadata.title
          }
        }
      })

      if (error) {
        setAuthState(prev => ({ ...prev, error, loading: false }))
        showError('Erreur d\'inscription', error.message)
        return { success: false, error }
      }

      // L'utilisateur doit confirmer son email
      if (data.user && !data.session) {
        showSuccess(
          'Inscription réussie', 
          'Vérifiez votre email pour confirmer votre compte. Votre accès sera activé après approbation.'
        )
      }

      return { success: true, data }
    } catch (error) {
      const authError = error as AuthError
      setAuthState(prev => ({ ...prev, error: authError, loading: false }))
      showError('Erreur d\'inscription', authError.message)
      return { success: false, error: authError }
    }
  }  // Connexion avec Google OAuth
  const signInWithGoogle = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      // Mode développement avec variables factices
      if (supabaseUrl.includes('dummy') || supabaseAnonKey.includes('dummy')) {
        // Simuler une authentification Google réussie en mode dev
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockUser: SupabaseUser = {
          id: 'google-user-' + Date.now(),
          email: 'test.google@codir.com',
          name: 'Utilisateur Google Test',
          title: 'Membre CODIR',
          role: 'director',
          canBook: true
        }

        setAuthState(prev => ({ 
          ...prev, 
          user: mockUser, 
          session: null, 
          loading: false, 
          error: null 
        }))
        
        showSuccess('Connexion réussie', `Bienvenue ${mockUser.name} (Mode développement)`)
        return { success: true, data: null }
      }
      
      // Mode production avec Supabase réel
      const client = requireSupabase()
      const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })

      if (error) {
        // Gestion spéciale pour le provider non configuré
        if (error.message.includes('provider is not enabled') || error.message.includes('Unsupported provider')) {
          setAuthState(prev => ({ ...prev, loading: false }))
          showError(
            'Google OAuth non configuré', 
            'Le provider Google n\'est pas activé dans Supabase. Consultez la documentation pour l\'activer.'
          )
          return { success: false, error }
        }
        setAuthState(prev => ({ ...prev, error, loading: false }))
        showError('Erreur de connexion Google', error.message)
        return { success: false, error }
      }

      // La redirection vers Google aura lieu automatiquement
      return { success: true, data }
    } catch (error) {
      const authError = error as AuthError
      setAuthState(prev => ({ ...prev, error: authError, loading: false }))
      showError('Erreur de connexion Google', authError.message)
      return { success: false, error: authError }
    }
  }
  // Déconnexion
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }))
      
      const client = requireSupabase()
      const { error } = await client.auth.signOut()
      
      if (error) {
        setAuthState(prev => ({ ...prev, error, loading: false }))
        showError('Erreur de déconnexion', error.message)
        return { success: false, error }
      }

      return { success: true }
    } catch (error) {
      const authError = error as AuthError
      setAuthState(prev => ({ ...prev, error: authError, loading: false }))
      showError('Erreur de déconnexion', authError.message)
      return { success: false, error: authError }
    }
  }
  // Réinitialisation du mot de passe
  const resetPassword = async (email: string) => {
    try {
      const client = requireSupabase()
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        showError('Erreur de réinitialisation', error.message)
        return { success: false, error }
      }

      showSuccess('Email envoyé', 'Vérifiez votre boîte mail pour réinitialiser votre mot de passe')
      return { success: true }
    } catch (error) {
      const authError = error as AuthError
      showError('Erreur de réinitialisation', authError.message)
      return { success: false, error: authError }
    }
  }
  // Authentification locale (login/mot de passe)
  const localSignIn = async (email: string, password: string): Promise<LocalAuthResult> => {
    try {
      // Vérifier si l'utilisateur est verrouillé
      if (isUserLocked(email)) {
        const remainingTime = getLockoutTimeRemaining(email)
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60
        const errorMessage = `Compte verrouillé. Réessayez dans ${minutes}m ${seconds}s.`
        showError('Erreur de connexion', errorMessage)
        return { success: false, error: errorMessage, lockoutTime: remainingTime }
      }

      // Authentifier l'utilisateur
      const result = authenticateUser(email, password)

      if (!result.success || !result.user) {
        // Gérer les tentatives restantes
        const remainingAttempts = getRemainingAttempts(email)
        if (remainingAttempts <= 0) {
          const errorMessage = 'Trop de tentatives échouées. Votre compte est maintenant verrouillé.'
          showError('Erreur de connexion', errorMessage)
          return { success: false, error: errorMessage }
        } else {
          const errorMessage = `${result.error || 'Erreur de connexion'}. Il vous reste ${remainingAttempts} tentative(s).`
          showError('Erreur de connexion', errorMessage)
          return { success: false, error: errorMessage, remainingAttempts }
        }
      }

      // Vérifier si un mot de passe initial doit être configuré
      if (requiresPasswordSetup(email)) {
        showError('Configuration du mot de passe', 'Veuillez configurer votre mot de passe initial.')
        return { success: false, requiresPasswordSetup: true }
      }

      // Connexion réussie
      const supabaseUser = convertToSupabaseUser(result.user)
      setAuthState(prev => ({
        ...prev,
        user: supabaseUser,
        session: null,
        loading: false,
        error: null
      }))
      showSuccess('Connexion réussie', `Bienvenue ${result.user.name}`)
      return { success: true, user: supabaseUser }
    } catch (error) {
      const authError = error as AuthError
      setAuthState(prev => ({ ...prev, error: authError, loading: false }))
      showError('Erreur de connexion', authError.message)
      return { success: false, error: authError.message }
    }
  }

  // Authentification locale par nom (nouvelle version)
  const localSignInByName = async (name: string, password: string): Promise<LocalAuthResult> => {
    try {
      // Vérifier si l'utilisateur est verrouillé
      if (isUserLocked(name)) {
        const remainingTime = getLockoutTimeRemaining(name)
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60
        const errorMessage = `Compte verrouillé. Réessayez dans ${minutes}m ${seconds}s.`
        showError('Erreur de connexion', errorMessage)
        return { success: false, error: errorMessage, lockoutTime: remainingTime }
      }

      // Authentifier l'utilisateur par nom
      const result = authenticateUserByName(name, password)
      
      if (result.success && result.user) {        // Créer un utilisateur Supabase simulé
        const supabaseUser: SupabaseUser = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          title: result.user.title,
          canBook: result.user.canBook
        }
        
        // Mettre à jour l'état d'authentification
        setAuthState({
          user: supabaseUser,
          session: null,
          loading: false,
          error: null
        })
        
        showSuccess('Connexion réussie', `Bienvenue ${result.user.name}!`)
        return { success: true, user: supabaseUser }
      } else {
        showError('Erreur de connexion', result.error || 'Échec de l\'authentification')
        return {
          success: false,
          error: result.error || 'Échec de l\'authentification',
          remainingAttempts: result.remainingAttempts,
          lockoutTime: result.lockoutTime,
          requiresPasswordSetup: result.requiresPasswordSetup
        }
      }
    } catch (error) {
      const errorMessage = 'Erreur lors de l\'authentification locale'
      showError('Erreur de connexion', errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  // Vérifier si un utilisateur doit définir son mot de passe (première connexion)
  const checkPasswordSetupRequired = (email: string): {
    required: boolean;
    user?: AuthorizedUser;
    temporaryPassword?: string;
  } => {
    return requiresPasswordSetup(email);
  }

  // Définir le mot de passe initial lors de la première connexion
  const setupInitialPassword = async (email: string, temporaryPassword: string, newPassword: string): Promise<PasswordSetupResult> => {
    try {
      const result = setInitialPassword(email, temporaryPassword, newPassword);
      
      if (result.success) {
        // Connecter automatiquement l'utilisateur après la configuration
        const authResult = authenticateUser(email, newPassword);
        if (authResult.success && authResult.user) {
          const supabaseUser = convertToSupabaseUser(authResult.user);
          setAuthState(prev => ({
            ...prev,
            user: supabaseUser,
            session: null,
            loading: false,
            error: null
          }));
          showSuccess('Mot de passe défini', 'Votre mot de passe a été configuré avec succès');
        }
      } else {
        showError('Erreur de configuration', result.error || 'Impossible de définir le mot de passe');
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Erreur lors de la configuration du mot de passe';
      showError('Erreur de configuration', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  // Vérifier si un utilisateur doit définir son mot de passe (par nom)
  const checkPasswordSetupRequiredByName = (name: string): {
    required: boolean;
    user?: AuthorizedUser;
    temporaryPassword?: string;
  } => {    return requiresPasswordSetup(name);
  }

  // Configuration du mot de passe initial par nom (nouvelle version)
  const setupInitialPasswordByName = async (name: string, temporaryPassword: string, newPassword: string): Promise<PasswordSetupResult> => {
    try {
      // Étape 1: Valider et définir le mot de passe localement
      const result = setInitialPassword(name, temporaryPassword, newPassword);
      
      if (!result.success) {
        showError('Erreur de configuration', result.error || 'Impossible de définir le mot de passe');
        return result;
      }

      // Étape 2: Connecter automatiquement l'utilisateur après la configuration
      const authResult = authenticateUserByName(name, newPassword);
      if (authResult.success && authResult.user) {
        const supabaseUser: SupabaseUser = {
          id: authResult.user.id,
          email: authResult.user.email,
          name: authResult.user.name,
          role: authResult.user.role,
          title: authResult.user.title,
          canBook: authResult.user.canBook
        };
        
        setAuthState(prev => ({
          ...prev,
          user: supabaseUser,
          session: null,
          loading: false,
          error: null
        }));
        
        showSuccess('Première connexion réussie', `Bienvenue ${authResult.user.name}! Votre mot de passe a été configuré avec succès.`);
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = 'Erreur lors de la configuration du mot de passe';
      showError('Erreur de configuration', errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  return {
    ...authState,
    signInWithPassword,
    signUpWithPassword,
    signInWithGoogle,
    signOut,
    resetPassword,
    localSignIn,
    setupInitialPassword,
    checkPasswordSetupRequired,
    localSignInByName,
    checkPasswordSetupRequiredByName,
    setupInitialPasswordByName
  }
}
