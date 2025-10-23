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
  login: (credentials) => {
    const config = {
      method: 'POST',
      url: '/api/auth/login',
      data: credentials
    }
    return fetch(`${API_BASE_URL}${config.url}`, {
      method: config.method,
      headers: {
        'Content-Type': 'application/json',
        ...addAuthToken({ headers: {} }).headers
      },
      body: JSON.stringify(credentials)
    }).then(res => res.json())
  },
  
  register: (userData) => {
    const config = {
      method: 'POST',
      url: '/api/auth/register',
      data: userData
    }
    return fetch(`${API_BASE_URL}${config.url}`, {
      method: config.method,
      headers: {
        'Content-Type': 'application/json',
        ...addAuthToken({ headers: {} }).headers
      },
      body: JSON.stringify(userData)
    }).then(res => res.json())
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
