import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PasswordChangeModal from './components/PasswordChangeModal.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Tasks from './pages/Tasks.jsx'
import Members from './pages/Members.jsx'
import OrgChart from './components/OrgChart.jsx'
import NotFound from './pages/NotFound.jsx'

function AppRoutes() {
  const { isAuthenticated, user } = useAuth()
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user?.password_change_required) {
      setShowPasswordModal(true)
    }
  }, [isAuthenticated, user])

  return (
    <>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route element={<ProtectedRoute /> }>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/org-chart" element={<OrgChart />} />
          <Route path="/members" element={<Members />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <PasswordChangeModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)}
        isFirstLogin={user?.password_change_required}
      />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container-page py-6">
          <AppRoutes />
        </main>
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  )
}


