import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI } from '../config/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  const login = async (email, password) => {
    try {
      setIsLoading(true)
      const response = await authAPI.login({ email, password })
      
      if (response.success) {
        setToken(response.data.token)
        setUser(response.data.user)
        toast.success('Signed in successfully')
        navigate('/')
      } else {
        toast.error(response.message || 'Login failed')
      }
    } catch (e) {
      console.error('Login error:', e)
      toast.error('Login failed - check your credentials')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name, email, password, role) => {
    try {
      setIsLoading(true)
      const response = await authAPI.register({ name, email, password, role })
      
      if (response.success) {
        setToken(response.data.token)
        setUser(response.data.user)
        toast.success('Account created successfully')
        navigate('/')
      } else {
        toast.error(response.message || 'Registration failed')
      }
    } catch (e) {
      console.error('Registration error:', e)
      toast.error('Registration failed - please try again')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setToken('')
    setUser(null)
    navigate('/login')
  }

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    register,
    logout,
  }), [token, user, isLoading])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


