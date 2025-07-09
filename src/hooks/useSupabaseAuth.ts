import { useState, useEffect } from 'react'
import { requireSupabase, withSupabase, type SupabaseUser } from '../lib/supabase'
import type { Session, User, AuthError } from '@supabase/supabase-js'
import { useToast } from '../contexts/ToastContext'

// Récupérer les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dummy.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key'

interface AuthState {
  user: SupabaseUser | null
  session: Session | null
  loading: boolean
  error: AuthError | null
}

export const useSupabaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })
  const { showError, showSuccess } = useToast()
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
            ...prev, 
            error: error as AuthError, 
            loading: false 
          }))
        }
      }
    }    getSession()

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
      
      const { data, error } = await supabase.auth.signInWithPassword({
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
  // Connexion avec Google OAuth
  const signInWithGoogle = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      // Mode développement avec variables factices
      if (supabaseUrl.includes('dummy') || supabaseAnonKey.includes('dummy')) {
        // Simuler une authentification Google réussie en mode dev
        await new Promise(resolve => setTimeout(resolve, 1000)) // Délai réaliste
          // Créer un utilisateur fictif pour le test
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setAuthState(prev => ({ ...prev, error, loading: false }))
        showError('Erreur de connexion Google', error.message)
        return { success: false, error }
      }

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
      
      const { error } = await supabase.auth.signOut()
      
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
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
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

  return {
    ...authState,
    signInWithPassword,
    signInWithGoogle,
    signOut,
    resetPassword
  }
}
