// Amélioration: Intégration Supabase réelle
import { createClient } from '@supabase/supabase-js'

// Remplacer l'authentification simulée par Supabase
export const authenticateUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  
  // Vérifier si l'utilisateur est dans la liste autorisée
  const authorizedUser = isUserAuthorized(email)
  if (!authorizedUser) {
    await supabase.auth.signOut()
    throw new Error('Utilisateur non autorisé')
  }
  
  return authorizedUser
}

// Authentification Google OAuth
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
  return { data, error }
}
