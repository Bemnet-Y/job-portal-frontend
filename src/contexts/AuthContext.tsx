import React, { createContext, useContext, useState, useEffect } from 'react'
import type { User } from '../types'
import { authAPI } from '../lib/api'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🔄 AuthProvider useEffect running') // Debug
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')

      console.log('📦 Stored auth data:', {
        token: !!token,
        userData: !!userData,
      }) // Debug

      if (token && userData) {
        const parsedUser = JSON.parse(userData)
        console.log('👤 Restoring user from storage:', parsedUser) // Debug
        setUser(parsedUser)
      }
    } catch (error) {
      console.error('❌ Error initializing auth:', error)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)

      console.log('🔐 AuthContext login started for:', email)

      const response = await authAPI.login({ email, password })
      const { token, user: userData } = response.data

      console.log('✅ AuthContext login successful:', userData)

      // Store in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))

      // Update state
      setUser(userData)

      console.log('💾 User data stored in localStorage and state')
    } catch (error: any) {
      console.error('❌ AuthContext login failed:', error)

      const errorMessage =
        error.response?.data?.message || error.message || 'Login failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: any) => {
    try {
      setError(null)
      setLoading(true)

      const response = await authAPI.register(data)
      const { token, user: userData } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Registration failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    console.log('🚪 Logging out user') // Debug
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setError(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
