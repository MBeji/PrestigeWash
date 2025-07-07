import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

// Types simplifiés pour le mode développement
export interface Booking {
  id: string
  user_id: string
  date: string
  time_slot: '08:00-10:00' | '10:00-12:00' | '14:00-16:00'
  created_at: string
  updated_at: string
  user?: {
    id: string
    name: string
    email: string
    title: string
  }
}

export interface User {
  id: string
  name: string
  email: string
  title: string
  role: 'member' | 'director' | 'admin' | 'viewer'
  canBook: boolean
}

interface DataContextType {
  // Bookings
  bookings: Booking[]
  bookingsLoading: boolean
  bookingsError: string | null
  createBooking: (userId: string, date: Date, timeSlot: string) => Promise<boolean>
  cancelBooking: (bookingId: string) => Promise<boolean>
  getUserBookings: (userId: string) => Booking[]
  getFutureBookings: (userId: string) => Booking[]
  getBookingsForDate: (date: Date) => Booking[]
  canUserBook: (userId: string, date: Date) => { canBook: boolean; reason?: string }
  refreshBookings: () => Promise<void>
  
  // Users
  users: User[]
  usersLoading: boolean
  usersError: string | null
  createUser: (userData: Omit<User, 'id'>) => Promise<boolean>
  updateUser: (userId: string, userData: Partial<User>) => Promise<boolean>
  deleteUser: (userId: string) => Promise<boolean>
  getUserById: (userId: string) => User | undefined
  refreshUsers: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

interface DataProviderProps {
  children: ReactNode
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [bookings] = useState<Booking[]>([])
  const [users] = useState<User[]>([])

  // Mock des fonctions pour le mode développement
  const createBooking = async (userId: string, date: Date, timeSlot: string): Promise<boolean> => {
    console.log('Mock createBooking:', { userId, date, timeSlot })
    return true
  }

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    console.log('Mock cancelBooking:', bookingId)
    return true
  }

  const getUserBookings = (userId: string): Booking[] => {
    return bookings.filter(booking => booking.user_id === userId)
  }

  const getFutureBookings = (userId: string): Booking[] => {
    const now = new Date()
    return bookings.filter(booking => 
      booking.user_id === userId && new Date(booking.date) >= now
    )
  }

  const getBookingsForDate = (date: Date): Booking[] => {
    const dateStr = date.toISOString().split('T')[0]
    return bookings.filter(booking => booking.date === dateStr)
  }

  const canUserBook = (userId: string, date: Date) => {
    return { canBook: true }
  }

  const refreshBookings = async () => {
    console.log('Mock refreshBookings')
  }

  const createUser = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    console.log('Mock createUser:', userData)
    return true
  }

  const updateUser = async (userId: string, userData: Partial<User>): Promise<boolean> => {
    console.log('Mock updateUser:', { userId, userData })
    return true
  }

  const deleteUser = async (userId: string): Promise<boolean> => {
    console.log('Mock deleteUser:', userId)
    return true
  }

  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId)
  }

  const refreshUsers = async () => {
    console.log('Mock refreshUsers')
  }

  const value: DataContextType = {
    // Bookings
    bookings,
    bookingsLoading: false,
    bookingsError: null,
    createBooking,
    cancelBooking,
    getUserBookings,
    getFutureBookings,
    getBookingsForDate,
    canUserBook,
    refreshBookings,
    
    // Users
    users,
    usersLoading: false,
    usersError: null,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    refreshUsers
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = (): DataContextType => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
