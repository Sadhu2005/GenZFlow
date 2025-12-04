import { useState, useEffect } from 'react'
import { Plus, User, Mail, Briefcase, Building, Users, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { employeesAPI } from '../config/api.js'
import toast from 'react-hot-toast'

export default function Members() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Developer',
    department_id: null,
    manager_id: null,
    bio: ''
  })

  // Check if user can add members
  const canAddMembers = ['CEO', 'Director', 'HR'].includes(user?.role)

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const response = await employeesAPI.getAll()
      if (response.success) {
        setEmployees(response.data.employees || [])
      }
    } catch (error) {
      toast.error('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await employeesAPI.create(formData)
      if (response.success) {
        toast.success(`Member added! Default password: ${response.data.default_password || 'GenZFlow@2024'}`)
        setShowModal(false)
        setFormData({
          name: '',
          email: '',
          role: 'Developer',
          department_id: null,
          manager_id: null,
          bio: ''
        })
        loadEmployees()
      } else {
        toast.error(response.message || 'Failed to add member')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add member')
    }
  }

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (role) => {
    const colors = {
      'CEO': 'bg-purple-100 text-purple-800',
      'Director': 'bg-blue-100 text-blue-800',
      'HR': 'bg-pink-100 text-pink-800',
      'Manager': 'bg-green-100 text-green-800',
      'Team Lead': 'bg-yellow-100 text-yellow-800',
      'Developer': 'bg-gray-100 text-gray-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  if (!canAddMembers) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600">You don't have permission to access this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Member Management</h1>
          <p className="text-secondary-600">Add and manage team members</p>
        </div>
        {canAddMembers && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Members List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-secondary-600">Loading members...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">{employee.name}</h3>
                    <p className="text-sm text-secondary-600 flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      {employee.email}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-secondary-400" />
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(employee.role)}`}>
                    {employee.role}
                  </span>
                </div>
                
                {employee.department_name && (
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-secondary-400" />
                    <span className="text-sm text-secondary-600">{employee.department_name}</span>
                  </div>
                )}
                
                {employee.manager_name && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-secondary-400" />
                    <span className="text-sm text-secondary-600">Manager: {employee.manager_name}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">Add New Member</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Role *</label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Developer">Developer</option>
                  <option value="Team Lead">Team Lead</option>
                  <option value="Manager">Manager</option>
                  <option value="HR">HR</option>
                  <option value="Director">Director</option>
                  <option value="CEO">CEO</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  placeholder="Optional bio"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> A default password will be assigned. The member must change it on first login.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-secondary-300 rounded-lg text-secondary-700 hover:bg-secondary-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}



