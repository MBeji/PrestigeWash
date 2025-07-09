import React, { useEffect } from 'react'
import { useSupabaseAuth } from '../hooks/useSupabaseAuth'

const AuthCallback: React.FC = () => {
  const { user, loading } = useSupabaseAuth()

  useEffect(() => {
    // Petite delay pour laisser le temps à Supabase de traiter l'auth
    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          console.log('✅ Utilisateur connecté via Google OAuth:', user)
          // Rediriger vers la page principale en rechargeant
          window.location.href = '/'
        } else {
          console.log('❌ Échec de la connexion Google OAuth')
          // Rediriger vers la page de connexion
          window.location.href = '/'
        }
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [user, loading])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Connexion en cours...</h2>
        <p className="text-gray-500">Finalisation de l'authentification Google</p>
      </div>
    </div>
  )
}

export default AuthCallback
