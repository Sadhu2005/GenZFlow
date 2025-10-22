import { Users, Briefcase, CheckCircle, Clock, Target, Calendar } from 'lucide-react'

export default function ManagerDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Manager Dashboard</h1>
          <p className="text-sm text-secondary-500">GenZFlow Team Management</p>
        </div>
        <div className="text-sm text-secondary-500">
          Team Management Overview
        </div>
      </div>

      {/* Team Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Team Members</p>
              <p className="text-2xl font-bold text-secondary-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Team Goals</p>
              <p className="text-2xl font-bold text-secondary-900">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Completed</p>
              <p className="text-2xl font-bold text-secondary-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">In Progress</p>
              <p className="text-2xl font-bold text-secondary-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Team Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-700">JD</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-secondary-900">John Developer</p>
                  <p className="text-xs text-secondary-500">Senior Developer</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">95%</div>
                <div className="text-xs text-secondary-500">8/8 tasks</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-700">SM</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-secondary-900">Sarah Manager</p>
                  <p className="text-xs text-secondary-500">Project Manager</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">88%</div>
                <div className="text-xs text-secondary-500">7/8 tasks</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-700">AJ</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-secondary-900">Alex Junior</p>
                  <p className="text-xs text-secondary-500">Junior Developer</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-orange-600">75%</div>
                <div className="text-xs text-secondary-500">6/8 tasks</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-red-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">Mobile App Launch</p>
                  <p className="text-xs text-secondary-500">High Priority</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-red-600">2 days</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-orange-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">API Documentation</p>
                  <p className="text-xs text-secondary-500">Medium Priority</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-orange-600">5 days</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">Code Review</p>
                  <p className="text-xs text-secondary-500">Low Priority</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">1 week</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
