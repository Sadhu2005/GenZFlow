import { Users, Briefcase, CheckCircle, Clock, TrendingUp, Building2 } from 'lucide-react'

export default function CEODashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">CEO Dashboard</h1>
          <p className="text-sm text-secondary-500">GenZFlow Executive Overview</p>
        </div>
        <div className="text-sm text-secondary-500">
          Welcome back, CEO
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Employees</p>
              <p className="text-2xl font-bold text-secondary-900">45</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Active Projects</p>
              <p className="text-2xl font-bold text-secondary-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Completed Tasks</p>
              <p className="text-2xl font-bold text-secondary-900">156</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-secondary-900">23</p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Department Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-primary-600 mr-2" />
                <span className="text-secondary-700">AI Team</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-secondary-900">85%</div>
                <div className="text-xs text-secondary-500">15 active tasks</div>
              </div>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-secondary-700">Web Team</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-secondary-900">92%</div>
                <div className="text-xs text-secondary-500">8 active tasks</div>
              </div>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-green-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-secondary-700">
                  <span className="font-medium">John Developer</span> completed "Implement user authentication"
                </p>
                <p className="text-xs text-secondary-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-blue-100 rounded-full">
                <Briefcase className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-secondary-700">
                  <span className="font-medium">Sarah Manager</span> created new project "Mobile App"
                </p>
                <p className="text-xs text-secondary-500">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-orange-100 rounded-full">
                <Users className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-secondary-700">
                  <span className="font-medium">HR Team</span> added 3 new employees
                </p>
                <p className="text-xs text-secondary-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
