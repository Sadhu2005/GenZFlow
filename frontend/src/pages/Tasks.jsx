import { useState } from 'react'
import { Plus, Filter, Search, Calendar, User, Flag, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import TaskCard from '../components/tasks/TaskCard.jsx'
import TaskModal from '../components/tasks/TaskModal.jsx'
import TaskFilters from '../components/tasks/TaskFilters.jsx'

const mockTasks = [
  {
    id: 1,
    title: "Implement user authentication",
    description: "Create login and registration system with JWT tokens",
    status: "Completed",
    priority: "High",
    assignedTo: "John Developer",
    assignedBy: "Sarah Manager",
    project: "Mobile App",
    dueDate: "2024-01-15",
    createdAt: "2024-01-10",
    progress: 100
  },
  {
    id: 2,
    title: "Design mobile UI components",
    description: "Create reusable components for the mobile application",
    status: "In Progress",
    priority: "Medium",
    assignedTo: "Emma Wilson",
    assignedBy: "Mike Chen",
    project: "Mobile App",
    dueDate: "2024-01-20",
    createdAt: "2024-01-12",
    progress: 65
  },
  {
    id: 3,
    title: "Write API documentation",
    description: "Document all REST API endpoints with examples",
    status: "Not Started",
    priority: "Low",
    assignedTo: "Alex Rivera",
    assignedBy: "Sarah Manager",
    project: "Backend API",
    dueDate: "2024-01-25",
    createdAt: "2024-01-14",
    progress: 0
  },
  {
    id: 4,
    title: "Code review for mobile app",
    description: "Review and test the mobile application code",
    status: "Overdue",
    priority: "Urgent",
    assignedTo: "David Kim",
    assignedBy: "Lisa Park",
    project: "Mobile App",
    dueDate: "2024-01-10",
    createdAt: "2024-01-08",
    progress: 30
  },
  {
    id: 5,
    title: "Database optimization",
    description: "Optimize database queries and add indexes",
    status: "In Progress",
    priority: "Medium",
    assignedTo: "Sophie Brown",
    assignedBy: "Mike Chen",
    project: "Backend API",
    dueDate: "2024-01-22",
    createdAt: "2024-01-13",
    progress: 45
  }
]

export default function Tasks() {
  const [tasks, setTasks] = useState(mockTasks)
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
    project: 'All'
  })

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filters.status === 'All' || task.status === filters.status
    const matchesPriority = filters.priority === 'All' || task.priority === filters.priority
    const matchesProject = filters.project === 'All' || task.project === filters.project

    return matchesSearch && matchesStatus && matchesPriority && matchesProject
  })

  const handleCreateTask = (taskData) => {
    const newTask = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      ...taskData,
      createdAt: new Date().toISOString().split('T')[0],
      progress: 0
    }
    setTasks([...tasks, newTask])
    setShowModal(false)
  }

  const handleUpdateTask = (taskData) => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? { ...task, ...taskData } : task
    ))
    setEditingTask(null)
    setShowModal(false)
  }

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowModal(true)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'Overdue':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Task Management</h1>
          <p className="text-secondary-600">GenZFlow - Where tasks flow seamlessly</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <TaskFilters filters={filters} onFiltersChange={setFilters} />
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-secondary-600">Total Tasks</p>
              <p className="text-xl font-bold text-secondary-900">{tasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-secondary-600">Completed</p>
              <p className="text-xl font-bold text-secondary-900">
                {tasks.filter(t => t.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-secondary-600">In Progress</p>
              <p className="text-xl font-bold text-secondary-900">
                {tasks.filter(t => t.status === 'In Progress').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-secondary-600">Overdue</p>
              <p className="text-xl font-bold text-secondary-900">
                {tasks.filter(t => t.status === 'Overdue').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-secondary-400 mb-4">
              <Clock className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No tasks found</h3>
            <p className="text-secondary-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
            />
          ))
        )}
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowModal(false)
            setEditingTask(null)
          }}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
        />
      )}
    </div>
  )
}
