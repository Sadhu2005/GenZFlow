import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Home, Users, CheckSquare } from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path
  
  return (
    <header className="bg-white border-b">
      <div className="container-page h-14 flex items-center justify-between">
        <Link to="/" className="font-semibold text-primary-700">GenZFlow</Link>
        
        {isAuthenticated && (
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm transition ${
                isActive('/') 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/tasks" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm transition ${
                isActive('/tasks') 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
              }`}
            >
              <CheckSquare className="h-4 w-4" />
              <span>Tasks</span>
            </Link>
            <Link 
              to="/org-chart" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm transition ${
                isActive('/org-chart') 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Org Chart</span>
            </Link>
          </nav>
        )}
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-secondary-600">{user?.name} · {user?.role}</span>
              <button onClick={logout} className="px-3 py-1.5 rounded-md bg-secondary-100 hover:bg-secondary-200 text-secondary-800 text-sm">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-sm text-primary-700">Login</Link>
          )}
        </div>
      </div>
    </header>
  )
}


