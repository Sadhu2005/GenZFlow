// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://genzflow-backend.onrender.com'

// Create axios instance with base configuration
const api = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
}

// Add request interceptor to include auth token
const addAuthToken = (config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

// Add response interceptor for error handling
const handleResponseError = (error) => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }
  return Promise.reject(error)
}

// API endpoints
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Login API error:', error)
      throw error
    }
  },
  
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Registration API error:', error)
      throw error
    }
  }
}

export const dashboardAPI = {
  getStats: () => {
    return fetch(`${API_BASE_URL}/api/dashboard/stats`, {
      headers: addAuthToken({ headers: {} }).headers
    }).then(res => res.json())
  }
}

export const tasksAPI = {
  getAll: () => {
    return fetch(`${API_BASE_URL}/api/tasks`, {
      headers: addAuthToken({ headers: {} }).headers
    }).then(res => res.json())
  },
  
  create: (taskData) => {
    return fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...addAuthToken({ headers: {} }).headers
      },
      body: JSON.stringify(taskData)
    }).then(res => res.json())
  },
  
  update: (id, taskData) => {
    return fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...addAuthToken({ headers: {} }).headers
      },
      body: JSON.stringify(taskData)
    }).then(res => res.json())
  },
  
  delete: (id) => {
    return fetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: 'DELETE',
      headers: addAuthToken({ headers: {} }).headers
    }).then(res => res.json())
  }
}

export const employeesAPI = {
  getAll: () => {
    return fetch(`${API_BASE_URL}/api/employees`, {
      headers: addAuthToken({ headers: {} }).headers
    }).then(res => res.json())
  }
}

export const projectsAPI = {
  getAll: () => {
    return fetch(`${API_BASE_URL}/api/projects`, {
      headers: addAuthToken({ headers: {} }).headers
    }).then(res => res.json())
  }
}

export default api
