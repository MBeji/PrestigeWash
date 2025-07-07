import React, { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useBookings, type Booking } from '../hooks/useBookings'
import { useUsers, type User } from '../hooks/useUsers'

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
  getUser: (id: string) => User | undefined
  getUserByEmail: (email: string) => User | undefined
  updateUser: (id: string, updates: Partial<User>) => Promise<boolean>
  createUser: (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => Promise<boolean>
  deleteUser: (id: string) => Promise<boolean>
  refreshUsers: () => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

interface DataProviderProps {
  children: ReactNode
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
    createBooking,
    cancelBooking,
    getUserBookings,
    getFutureBookings,
    getBookingsForDate,
    canUserBook,
    refreshBookings
  } = useBookings()

  const {
    users,
    loading: usersLoading,
    error: usersError,
    getUser,
    getUserByEmail,
    updateUser,
    createUser,
    deleteUser,
    refreshUsers
  } = useUsers()

  const value: DataContextType = {
    // Bookings
    bookings,
    bookingsLoading,
    bookingsError,
    createBooking,
    cancelBooking,
    getUserBookings,
    getFutureBookings,
    getBookingsForDate,
    canUserBook,
    refreshBookings,
    
    // Users
    users,
    usersLoading,
    usersError,
    getUser,
    getUserByEmail,
    updateUser,
    createUser,
    deleteUser,
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

export { type Booking, type User }
