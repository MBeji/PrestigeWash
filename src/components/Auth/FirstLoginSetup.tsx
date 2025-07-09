import React, { useState } from 'react'
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth'

interface FirstLoginSetupProps {
  email: string
  userName: string
  temporaryPassword: string
  onCancel: () => void
}

export const FirstLoginSetup: React.FC<FirstLoginSetupProps> = ({ 
  email, 
  userName, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    tempPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showTempPassword, setShowTempPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const { setupInitialPassword } = useSupabaseAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Effacer l'erreur correspondante
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.tempPassword) {
      newErrors.tempPassword = 'Mot de passe temporaire requis'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Nouveau mot de passe requis'
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmation requise'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      const result = await setupInitialPassword(
        email,
        formData.tempPassword,
        formData.newPassword
      )
      
      if (!result.success) {
        setErrors({ submit: result.error || 'Erreur lors de la configuration' })
      }
      // Si succès, l'utilisateur sera connecté automatiquement
    } catch (error) {
      setErrors({ submit: 'Une erreur est survenue. Veuillez réessayer.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🔐 Première Connexion
            </h2>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Bienvenue, {userName}!
            </h3>
            <p className="text-sm text-gray-600">
              Vous devez définir votre mot de passe pour accéder à l'application
            </p>
          </div>

          {/* Information du mot de passe temporaire */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Instructions :</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Saisissez votre mot de passe temporaire fourni par l'administrateur</li>
              <li>Choisissez un nouveau mot de passe sécurisé (minimum 8 caractères)</li>
              <li>Confirmez votre nouveau mot de passe</li>
            </ol>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mot de passe temporaire */}
            <div>
              <label htmlFor="tempPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe temporaire
              </label>
              <div className="relative">
                <input
                  id="tempPassword"
                  name="tempPassword"
                  type={showTempPassword ? 'text' : 'password'}
                  required
                  value={formData.tempPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.tempPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Entrez votre mot de passe temporaire"
                />
                <button
                  type="button"
                  onClick={() => setShowTempPassword(!showTempPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showTempPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L15.12 15.12" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.tempPassword && <p className="mt-1 text-sm text-red-600">{errors.tempPassword}</p>}
            </div>

            {/* Nouveau mot de passe */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.newPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Choisissez un mot de passe sécurisé"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L15.12 15.12" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
            </div>

            {/* Confirmation du mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le nouveau mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirmez votre nouveau mot de passe"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Message d'erreur général */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            )}

            {/* Boutons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Configuration...
                  </div>
                ) : (
                  'Définir le mot de passe'
                )}
              </button>
            </div>
          </form>

          {/* Informations de sécurité */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Conseils de sécurité :</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Utilisez au moins 8 caractères</li>
              <li>• Mélangez lettres majuscules et minuscules</li>
              <li>• Incluez des chiffres et des caractères spéciaux</li>
              <li>• Évitez les mots de passe trop simples</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
