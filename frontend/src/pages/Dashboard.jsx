import { useAuth } from '../context/AuthContext.jsx'
import CEODashboard from '../components/dashboard/CEODashboard.jsx'
import ManagerDashboard from '../components/dashboard/ManagerDashboard.jsx'
import EmployeeDashboard from '../components/dashboard/EmployeeDashboard.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  
  const renderDashboard = () => {
    switch (user?.role) {
      case 'CEO':
        return <CEODashboard />
      case 'Director':
      case 'Manager':
        return <ManagerDashboard />
      default:
        return <EmployeeDashboard />
    }
  }

  return renderDashboard()
}


