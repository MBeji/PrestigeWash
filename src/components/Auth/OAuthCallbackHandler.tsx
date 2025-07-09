import React, { useEffect, useState } from 'react'
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth'

interface OAuthCallbackHandlerProps {
  children: React.ReactNode
}

const OAuthCallbackHandler: React.FC<OAuthCallbackHandlerProps> = ({ children }) => {
  const { user, loading } = useSupabaseAuth()
  const [isOAuthCallback, setIsOAuthCallback] = useState(false)

  useEffect(() => {
    // Vérifier si nous sommes dans un callback OAuth
    const urlParams = new URLSearchParams(window.location.search)
    const hasOAuthParams = urlParams.has('code') || urlParams.has('access_token') || urlParams.has('state')
    
    if (hasOAuthParams) {
      setIsOAuthCallback(true)
      console.log('🔄 Callback OAuth détecté:', Object.fromEntries(urlParams))
    }
  }, [])

  useEffect(() => {
    if (isOAuthCallback && !loading) {
      const timer = setTimeout(() => {
        if (user) {
          console.log('✅ Utilisateur connecté via Google OAuth:', user)
          // Nettoyer l'URL des paramètres OAuth
          window.history.replaceState({}, document.title, window.location.pathname)
          setIsOAuthCallback(false)
        } else {
          console.log('❌ Échec de la connexion Google OAuth')
          // Nettoyer l'URL et rester sur la page de connexion
          window.history.replaceState({}, document.title, window.location.pathname)
          setIsOAuthCallback(false)
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [user, loading, isOAuthCallback])

  if (isOAuthCallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            🔐 Connexion avec Google en cours...
          </h2>
          <p className="text-gray-500">
            Finalisation de l'authentification, veuillez patienter
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default OAuthCallbackHandler
