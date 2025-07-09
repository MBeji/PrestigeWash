import React, { useState } from 'react'
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth'
import { isSupabaseConfigured } from '../../lib/supabase'
import { isUserAuthorizedByName } from '../../config/authorizedUsers'
import { FirstLoginSetup } from './FirstLoginSetup'

interface AuthFormData {
  loginName: string // Nom de la personne pour l'authentification
  password: string
  email?: string // Email uniquement pour l'inscription Supabase
  name?: string
  title?: string
  confirmPassword?: string
}

type AuthMode = 'supabase' | 'local'

export const ProductionAuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>('supabase')
  const [formData, setFormData] = useState<AuthFormData>({
    loginName: '',
    password: '',
    email: '',
    name: '',
    title: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showFirstLoginSetup, setShowFirstLoginSetup] = useState(false)
  const [firstLoginData, setFirstLoginData] = useState<{
    email: string
    userName: string
    temporaryPassword: string
  } | null>(null)

  const { signInWithPassword, signUpWithPassword, signInWithGoogle, resetPassword, localSignInByName, checkPasswordSetupRequiredByName } = useSupabaseAuth()
  const supabaseConfigured = isSupabaseConfigured()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validation du nom d'utilisateur (login)
    if (!formData.loginName) {
      newErrors.loginName = 'Nom requis'
    } else if (formData.loginName.trim().length < 2) {
      newErrors.loginName = 'Le nom doit contenir au moins 2 caractères'
    }

    // Validation de l'email uniquement pour l'inscription Supabase
    if (isSignUp && authMode === 'supabase') {
      if (!formData.email) {
        newErrors.email = 'Email requis'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Format email invalide'
      }
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis'
    } else if (authMode === 'supabase' && formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }

    if (isSignUp) {
      if (!formData.name) {
        newErrors.name = 'Nom requis'
      }
      if (!formData.title) {
        newErrors.title = 'Titre/Fonction requis'
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmation requise'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {      if (authMode === 'local') {
        // Authentification locale pour les utilisateurs autorisés
        const result = await localSignInByName(formData.loginName, formData.password)
        
        if (!result.success) {
          // Vérifier si l'utilisateur doit définir son mot de passe
          if (result.requiresPasswordSetup) {
            const setupInfo = checkPasswordSetupRequiredByName(formData.loginName)
            if (setupInfo.required && setupInfo.user && setupInfo.temporaryPassword) {
              setFirstLoginData({
                email: formData.loginName, // Utiliser le nom comme identifiant
                userName: setupInfo.user.name,
                temporaryPassword: setupInfo.temporaryPassword
              })
              setShowFirstLoginSetup(true)
              return
            }
          }
          
          let errorMessage = result.error || 'Erreur de connexion'
          
          if (result.lockoutTime) {
            const minutes = Math.floor(result.lockoutTime / 60)
            const seconds = result.lockoutTime % 60
            errorMessage = `Compte verrouillé. Réessayez dans ${minutes}m ${seconds}s.`
          } else if (result.remainingAttempts !== undefined) {
            errorMessage = `${result.error}. Tentatives restantes: ${result.remainingAttempts}`
          }
          
          setErrors({ submit: errorMessage })
        }      } else {
        // Authentification Supabase standard
        if (isSignUp) {
          const result = await signUpWithPassword(
            formData.email || '',
            formData.password,
            {
              name: formData.name!,
              title: formData.title!
            }
          )
          
          if (!result.success && result.error) {
            setErrors({ submit: result.error.message })
          }
        } else {
          const result = await signInWithPassword(formData.email || '', formData.password)
          
          if (!result.success && result.error) {
            setErrors({ submit: result.error.message })
          }
        }
      }
    } catch (error) {
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithGoogle()
      if (!result.success && result.error) {
        setErrors({ submit: result.error.message })
      }
    } catch (error) {
      setErrors({ submit: 'Erreur lors de la connexion avec Google' })
    } finally {
      setIsLoading(false)
    }
  }
  const handleForgotPassword = async () => {
    if (authMode === 'local') {
      if (!formData.loginName) {
        setErrors({ loginName: 'Entrez votre nom pour réinitialiser le mot de passe' })
        return
      }
      // Pour l'authentification locale, afficher un message d'information
      setErrors({ submit: 'Pour l\'authentification locale, contactez l\'administrateur pour réinitialiser votre mot de passe.' })
    } else {
      if (!formData.email) {
        setErrors({ email: 'Entrez votre email pour réinitialiser le mot de passe' })
        return
      }
      
      setIsLoading(true)
      try {
        await resetPassword(formData.email)
      } catch (error) {
        setErrors({ submit: 'Erreur lors de l\'envoi de l\'email de réinitialisation' })
      } finally {
        setIsLoading(false)
      }
    }
  }
  // Vérifier si l'utilisateur peut utiliser l'authentification locale
  const canUseLocalAuth = (loginName: string): boolean => {
    return isUserAuthorizedByName(loginName) !== null
  }

  // Détecter automatiquement le mode d'authentification basé sur le nom
  const handleLoginNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const loginName = e.target.value
    handleChange(e)
    
    // Basculer automatiquement vers l'authentification locale si l'utilisateur est autorisé
    if (loginName && canUseLocalAuth(loginName)) {
      setAuthMode('local')
    } else {
      setAuthMode('supabase')
    }
  }

  // Afficher le composant de première connexion si nécessaire
  if (showFirstLoginSetup && firstLoginData) {
    return (
      <FirstLoginSetup
        email={firstLoginData.email}
        userName={firstLoginData.userName}
        temporaryPassword={firstLoginData.temporaryPassword}
        onCancel={() => {
          setShowFirstLoginSetup(false)
          setFirstLoginData(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🚗 Auto Wash Club VIP
            </h2>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {isSignUp ? 'Demande d\'accès' : 'Connexion'}
            </h3>
            <p className="text-sm text-gray-600">
              {isSignUp 
                ? 'Créez votre compte pour demander l\'accès au calendrier'
                : 'Connectez-vous pour accéder au calendrier de réservations'
              }
            </p>
            
            {/* Indicateur du mode */}
            <div className={`mt-4 px-3 py-1 rounded-full text-xs font-medium ${
              supabaseConfigured 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {supabaseConfigured ? '🔒 Mode Production' : '🔧 Mode Développement'}
            </div>
          </div>

          {/* Google OAuth Button */}
          {supabaseConfigured && (
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-3"></div>
                ) : (
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continuer avec Google
              </button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>
            </div>
          )}          {/* Login Name / Email Field */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom d'utilisateur (login) */}
            <div>
              <label htmlFor="loginName" className="block text-sm font-medium text-gray-700">
                Nom d'utilisateur
              </label>
              <input
                id="loginName"
                name="loginName"
                type="text"
                required
                value={formData.loginName}
                onChange={handleLoginNameChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.loginName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Votre nom (ex: Dorsaf, Najla, etc.)"
              />
              {errors.loginName && <p className="mt-1 text-sm text-red-600">{errors.loginName}</p>}
              
              {/* Indicateur du mode d'authentification */}
              {formData.loginName && (
                <div className="mt-2">
                  {authMode === 'local' ? (
                    <div className="flex items-center text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Utilisateur autorisé - Authentification locale
                    </div>
                  ) : (
                    <div className="flex items-center text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-md">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Mode inscription - Authentification Supabase
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Email (inscription Supabase seulement) */}
            {isSignUp && authMode === 'supabase' && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="votre.email@company.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            )}

            {/* Nom (inscription seulement) */}
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom complet
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Jean Dupont"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
            )}

            {/* Titre (inscription seulement) */}
            {isSignUp && (
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Titre/Fonction
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Directeur, Manager, etc."
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>
            )}

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirmation mot de passe (inscription seulement) */}
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Erreur générale */}
            {errors.submit && (
              <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-md">
                {errors.submit}
              </div>
            )}            {/* Bouton principal */}
            <button
              type="submit"
              disabled={isLoading || (authMode === 'local' && isSignUp)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {authMode === 'local' ? 'Connexion...' : (isSignUp ? 'Inscription...' : 'Connexion...')}
                </div>
              ) : (
                authMode === 'local' ? 'Se connecter' : (isSignUp ? 'Demander l\'accès' : 'Se connecter')
              )}
            </button>

            {/* Message d'information pour l'authentification locale */}
            {authMode === 'local' && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  <strong>🔒 Connexion sécurisée :</strong> Vous êtes un utilisateur autorisé. Utilisez vos identifiants fournis par l'administrateur.
                </p>
              </div>
            )}{/* Liens secondaires */}
            <div className="flex flex-col space-y-2">
              {/* Masquer le lien d'inscription pour les utilisateurs en authentification locale */}
              {authMode !== 'local' && (
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-blue-600 hover:text-blue-500 text-center"
                >
                  {isSignUp 
                    ? 'Déjà un compte ? Se connecter'
                    : 'Pas encore de compte ? Demander l\'accès'
                  }
                </button>
              )}

              {!isSignUp && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="text-sm text-gray-600 hover:text-gray-500 text-center"
                >                  {authMode === 'local' 
                    ? 'Problème de connexion ? Contactez l\'administrateur'
                    : 'Mot de passe oublié ?'
                  }
                </button>
              )}
            </div>
          </form>

          {/* Note pour l'inscription */}
          {isSignUp && supabaseConfigured && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>📋 Processus d'inscription :</strong>
              </p>
              <ol className="text-sm text-blue-700 mt-2 list-decimal list-inside space-y-1">
                <li>Vérification de votre email (lien de confirmation)</li>
                <li>Examen de votre demande par un administrateur</li>
                <li>Activation de votre accès et notification par email</li>
              </ol>
            </div>
          )}

          {/* Mode développement info */}
          {!supabaseConfigured && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>🔧 Mode Développement :</strong> L'application fonctionne avec des données simulées. 
                Configurez Supabase pour activer l'authentification réelle.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductionAuthForm
