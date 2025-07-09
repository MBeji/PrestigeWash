import React, { useState } from 'react'
import { 
  userCredentials, 
  getSecurityStats, 
  resetUserPassword, 
  changeUserPassword, 
  unlockUser
} from '../../config/authorizedUsers'

interface UserManagementProps {
  currentUser: {
    role: string
    canViewAll: boolean
  }
}

export const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
  const [showPasswords, setShowPasswords] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Seuls les CEO et administrateurs peuvent gérer les utilisateurs
  if (currentUser.role !== 'ceo' && !currentUser.canViewAll) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Accès refusé. Seuls les administrateurs peuvent gérer les utilisateurs.</p>
      </div>
    )
  }

  const securityStats = getSecurityStats()

  const handleResetPassword = async (userId: string) => {
    setIsLoading(true)
    try {
      const result = resetUserPassword(userId)
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `Mot de passe réinitialisé. Nouveau mot de passe temporaire : ${result.temporaryPassword}` 
        })
      } else {
        setMessage({ type: 'error', text: result.error || 'Erreur lors de la réinitialisation' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la réinitialisation' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (userId: string) => {
    if (!newPassword) {
      setMessage({ type: 'error', text: 'Veuillez entrer un nouveau mot de passe' })
      return
    }

    setIsLoading(true)
    try {
      const result = changeUserPassword(userId, newPassword)
      if (result.success) {
        setMessage({ type: 'success', text: 'Mot de passe modifié avec succès' })
        setNewPassword('')
        setSelectedUser(null)
      } else {
        setMessage({ type: 'error', text: result.error || 'Erreur lors de la modification' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la modification' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnlockUser = (email: string) => {
    const success = unlockUser(email)
    if (success) {
      setMessage({ type: 'success', text: 'Utilisateur débloqué avec succès' })
    } else {
      setMessage({ type: 'error', text: 'Erreur lors du déblocage' })
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ceo': return 'bg-purple-100 text-purple-800'
      case 'director': return 'bg-blue-100 text-blue-800'
      case 'viewer': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Titre */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
        <button
          onClick={() => setShowPasswords(!showPasswords)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {showPasswords ? 'Masquer les mots de passe' : 'Afficher les mots de passe'}
        </button>
      </div>

      {/* Statistiques de sécurité */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques de Sécurité</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Utilisateurs totaux</p>
            <p className="text-2xl font-bold text-blue-900">{securityStats.totalUsers}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600">Utilisateurs bloqués</p>
            <p className="text-2xl font-bold text-red-900">{securityStats.lockedUsers}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600">Durée de verrouillage</p>
            <p className="text-2xl font-bold text-yellow-900">{securityStats.lockoutDuration}min</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {message.text}
          </p>
        </div>
      )}

      {/* Utilisateurs bloqués */}
      {securityStats.lockedUsersList.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-2">Utilisateurs bloqués</h4>
          <div className="space-y-2">
            {securityStats.lockedUsersList.map((lockedUser) => (
              <div key={lockedUser.email} className="flex justify-between items-center bg-white p-3 rounded-md">
                <div>
                  <p className="text-sm font-medium text-gray-900">{lockedUser.email}</p>
                  <p className="text-xs text-gray-500">Temps restant: {lockedUser.remainingTime}s</p>
                </div>
                <button
                  onClick={() => handleUnlockUser(lockedUser.email)}
                  className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Débloquer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Liste des Utilisateurs Autorisés</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                {showPasswords && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mot de passe
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userCredentials.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  {showPasswords && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {user.password}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleResetPassword(user.id)}
                      disabled={isLoading}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Réinitialiser
                    </button>
                    <button
                      onClick={() => setSelectedUser(user.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de modification de mot de passe */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier le mot de passe</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Entrer le nouveau mot de passe"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedUser(null)
                    setNewPassword('')
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleChangePassword(selectedUser)}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
