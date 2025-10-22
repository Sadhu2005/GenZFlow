import { useState } from 'react'
import { Calendar, User, Flag, MoreVertical, Edit, Trash2, CheckCircle } from 'lucide-react'

export default function TaskCard({ task, onEdit, onDelete, onUpdate }) {
  const [showActions, setShowActions] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Urgent':
        return '🔴'
      case 'High':
        return '🟠'
      case 'Medium':
        return '🟡'
      case 'Low':
        return '🟢'
      default:
        return '⚪'
    }
  }

  const handleStatusChange = (newStatus) => {
    onUpdate({ ...task, status: newStatus })
    setShowActions(false)
  }

  const handleProgressChange = (newProgress) => {
    const newStatus = newProgress === 100 ? 'Completed' : 
                     newProgress > 0 ? 'In Progress' : 'Not Started'
    onUpdate({ ...task, progress: newProgress, status: newStatus })
  }

  const isOverdue = () => {
    if (task.status === 'Completed') return false
    return new Date(task.dueDate) < new Date()
  }

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-secondary-900">{task.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                {getPriorityIcon(task.priority)} {task.priority}
              </span>
            </div>
            
            <p className="text-secondary-600 mb-4">{task.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-500">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Assigned to: <span className="font-medium text-secondary-700">{task.assignedTo}</span></span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span className={isOverdue() ? 'text-red-600 font-medium' : ''}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Flag className="h-4 w-4" />
                <span>Project: <span className="font-medium text-secondary-700">{task.project}</span></span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-secondary-100 rounded-lg transition"
            >
              <MoreVertical className="h-4 w-4 text-secondary-500" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-10 bg-white border rounded-lg shadow-lg z-10 min-w-[160px]">
                <button
                  onClick={() => {
                    onEdit(task)
                    setShowActions(false)
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-secondary-50"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id)
                    setShowActions(false)
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-secondary-50 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
                <div className="border-t">
                  <div className="px-4 py-2 text-xs font-medium text-secondary-500">Quick Actions</div>
                  <button
                    onClick={() => handleStatusChange('In Progress')}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-secondary-50"
                  >
                    <Clock className="h-4 w-4" />
                    <span>Start Task</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange('Completed')}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-secondary-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Complete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-secondary-700">Progress</span>
            <span className="text-sm text-secondary-600">{task.progress}%</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
          <div className="flex space-x-2 mt-2">
            {[0, 25, 50, 75, 100].map(progress => (
              <button
                key={progress}
                onClick={() => handleProgressChange(progress)}
                className={`px-2 py-1 text-xs rounded ${
                  task.progress === progress
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-secondary-500 hover:bg-secondary-100'
                }`}
              >
                {progress}%
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
