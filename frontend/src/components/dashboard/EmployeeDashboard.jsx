import { CheckCircle, Clock, Target, Calendar, Star, TrendingUp } from 'lucide-react'

export default function EmployeeDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">My Dashboard</h1>
          <p className="text-sm text-secondary-500">GenZFlow Personal Workspace</p>
        </div>
        <div className="text-sm text-secondary-500">
          Welcome back!
        </div>
      </div>

      {/* Personal Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Target className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">My Tasks</p>
              <p className="text-2xl font-bold text-secondary-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Completed</p>
              <p className="text-2xl font-bold text-secondary-900">5</p>
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
              <p className="text-2xl font-bold text-secondary-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Performance</p>
              <p className="text-2xl font-bold text-secondary-900">92%</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Tasks & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">My Tasks</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">Implement user authentication</p>
                  <p className="text-xs text-secondary-500">Completed • 2 hours ago</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Done</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-orange-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">Design mobile UI components</p>
                  <p className="text-xs text-secondary-500">In Progress • Due tomorrow</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Active</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Target className="h-4 w-4 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">Write API documentation</p>
                  <p className="text-xs text-secondary-500">Not Started • Due in 3 days</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Pending</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-red-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">Code review for mobile app</p>
                  <p className="text-xs text-secondary-500">Overdue • 1 day late</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Urgent</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Performance Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Task Completion Rate</span>
              <span className="text-sm font-medium text-secondary-900">92%</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">On-time Delivery</span>
              <span className="text-sm font-medium text-secondary-900">88%</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-600">Quality Score</span>
              <span className="text-sm font-medium text-secondary-900">95%</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '95%' }}></div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-primary-50 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-primary-900">Great job this week!</p>
                <p className="text-xs text-primary-700">You've exceeded expectations on 3 tasks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
