import { useState, useEffect } from 'react'
import { requireSupabase, withSupabase } from '../lib/supabase'
import { useToast } from '../contexts/ToastContext'

export interface User {
  id: string
  email: string
  name: string
  title: string
  role: 'ceo' | 'director' | 'viewer'
  can_book: boolean
  created_at: string
  updated_at: string
}

interface UseUsersReturn {
  users: User[]
  loading: boolean
  error: string | null
  getUser: (id: string) => User | undefined
  getUserByEmail: (email: string) => User | undefined
  updateUser: (id: string, updates: Partial<User>) => Promise<boolean>
  createUser: (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>
  deleteUser: (id: string) => Promise<boolean>
  refreshUsers: () => Promise<void>
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { showError, showSuccess } = useToast()
  // Récupérer tous les utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const client = requireSupabase()
      const { data, error: fetchError } = await client
        .from('users')
        .select('*')
        .order('name', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      setUsers(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs'
      setError(errorMessage)
      showError('Erreur de chargement', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Obtenir un utilisateur par ID
  const getUser = (id: string): User | undefined => {
    return users.find(user => user.id === id)
  }

  // Obtenir un utilisateur par email
  const getUserByEmail = (email: string): User | undefined => {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase())
  }
  // Mettre à jour un utilisateur
  const updateUser = async (id: string, updates: Partial<User>): Promise<boolean> => {
    try {
      const client = requireSupabase()
      const { data, error: updateError } = await client
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      // Mettre à jour l'état local
      if (data) {
        setUsers(prev => prev.map(user => 
          user.id === id ? { ...user, ...data } : user
        ))
        showSuccess('Utilisateur mis à jour', 'Les modifications ont été sauvegardées')
      }

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      showError('Erreur de mise à jour', errorMessage)
      return false
    }
  }
  // Créer un nouvel utilisateur
  const createUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    try {
      const client = requireSupabase()
      const { data, error: insertError } = await client
        .from('users')
        .insert(userData)
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      // Ajouter l'utilisateur à l'état local
      if (data) {
        setUsers(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
        showSuccess('Utilisateur créé', `${data.name} a été ajouté avec succès`)
      }

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création'
      showError('Erreur de création', errorMessage)
      return false
    }
  }
  // Supprimer un utilisateur
  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      const userToDelete = getUser(id)
      
      const client = requireSupabase()
      const { error: deleteError } = await client
        .from('users')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      // Supprimer l'utilisateur de l'état local
      setUsers(prev => prev.filter(user => user.id !== id))
      showSuccess(
        'Utilisateur supprimé', 
        userToDelete ? `${userToDelete.name} a été supprimé` : 'L\'utilisateur a été supprimé'
      )

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      showError('Erreur de suppression', errorMessage)
      return false
    }
  }

  // Fonction pour rafraîchir les données
  const refreshUsers = async () => {
    await fetchUsers()
  }

  // Charger les données au montage
  useEffect(() => {
    fetchUsers()
  }, [])
  // S'abonner aux changements en temps réel
  useEffect(() => {
    const result = withSupabase(client => {
      const channel = client
        .channel('users_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'users' },
          () => {
            // Recharger les données quand il y a des changements
            fetchUsers()
          }
        )
        .subscribe()

      return () => {
        client.removeChannel(channel)
      }
    })

    return result || undefined
  }, [])

  return {
    users,
    loading,
    error,
    getUser,
    getUserByEmail,
    updateUser,
    createUser,
    deleteUser,
    refreshUsers
  }
}
