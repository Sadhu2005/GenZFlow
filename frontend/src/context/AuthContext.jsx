import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

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
      // TODO: replace with backend API call
      // const { data } = await axios.post('/api/auth/login', { email, password })
      // setToken(data.token); setUser(data.user)
      await new Promise(r => setTimeout(r, 600))
      setToken('demo-token')
      setUser({ id: 1, name: 'Demo User', email, role: 'CEO' })
      toast.success('Signed in')
      navigate('/')
    } catch (e) {
      toast.error('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name, email, password, role) => {
    try {
      setIsLoading(true)
      // TODO: replace with backend API call
      // const { data } = await axios.post('/api/auth/register', { name, email, password, role })
      // setToken(data.token); setUser(data.user)
      await new Promise(r => setTimeout(r, 800))
      setToken('demo-token')
      setUser({ id: 2, name, email, role })
      toast.success('Account created successfully')
      navigate('/')
    } catch (e) {
      toast.error('Registration failed')
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


