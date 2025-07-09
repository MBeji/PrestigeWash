import React, { useState } from 'react'
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth'

interface AuthFormData {
  email: string
  password: string
  name?: string
  title?: string
  confirmPassword?: string
}

export const ProductionAuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: '',
    title: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { signInWithPassword, signUpWithPassword, resetPassword } = useSupabaseAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validation email
    if (!formData.email) {
      newErrors.email = 'Email requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email invalide'
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }

    // Validations spécifiques à l'inscription
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
    
    try {
      if (isSignUp) {
        const result = await signUpWithPassword(
          formData.email,
          formData.password,
          {
            name: formData.name!,
            title: formData.title!
          }
        )
        
        if (result.success) {
          // Afficher message de confirmation
          alert('Inscription réussie ! Vérifiez votre email pour confirmer votre compte. Votre accès sera activé après approbation par un administrateur.')
        }
      } else {
        const result = await signInWithPassword(formData.email, formData.password)
        
        if (!result.success && result.error) {
          setErrors({ submit: result.error.message })
        }
      }
    } catch (error) {
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Entrez votre email pour réinitialiser le mot de passe' })
      return
    }

    setIsLoading(true)
    try {
      await resetPassword(formData.email)
      alert('Email de réinitialisation envoyé ! Vérifiez votre boîte mail.')
    } catch (error) {
      setErrors({ submit: 'Erreur lors de l\'envoi de l\'email de réinitialisation' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center">
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
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email */}
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
              <div className="text-sm text-red-600 text-center">
                {errors.submit}
              </div>
            )}

            {/* Bouton principal */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isSignUp ? 'Inscription...' : 'Connexion...'}
                </div>
              ) : (
                isSignUp ? 'Demander l\'accès' : 'Se connecter'
              )}
            </button>

            {/* Liens secondaires */}
            <div className="flex flex-col space-y-2">
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

              {!isSignUp && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="text-sm text-gray-600 hover:text-gray-500 text-center"
                >
                  Mot de passe oublié ?
                </button>
              )}
            </div>
          </form>

          {/* Note pour l'inscription */}
          {isSignUp && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note :</strong> Après inscription, votre compte sera en attente d'approbation. 
                Un administrateur examinera votre demande et vous accordera l'accès approprié.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductionAuthForm
