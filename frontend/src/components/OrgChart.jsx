import { useState } from 'react'
import { ChevronDown, ChevronRight, Users, Crown, Shield, User } from 'lucide-react'

const orgData = {
  id: 1,
  name: "GenZFlow",
  role: "CEO",
  children: [
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Director of Technology",
      department: "Engineering",
      children: [
        {
          id: 3,
          name: "Mike Chen",
          role: "Engineering Manager",
          department: "Engineering",
          children: [
            { id: 4, name: "Alex Rivera", role: "Senior Developer", department: "Engineering" },
            { id: 5, name: "Emma Wilson", role: "Developer", department: "Engineering" }
          ]
        },
        {
          id: 6,
          name: "Lisa Park",
          role: "Product Manager",
          department: "Product",
          children: [
            { id: 7, name: "David Kim", role: "UX Designer", department: "Product" },
            { id: 8, name: "Sophie Brown", role: "Product Analyst", department: "Product" }
          ]
        }
      ]
    },
    {
      id: 9,
      name: "Robert Smith",
      role: "Director of Operations",
      department: "Operations",
      children: [
        {
          id: 10,
          name: "Jennifer Lee",
          role: "HR Manager",
          department: "Human Resources",
          children: [
            { id: 11, name: "Tom Anderson", role: "HR Specialist", department: "Human Resources" }
          ]
        },
        {
          id: 12,
          name: "Mark Davis",
          role: "Finance Manager",
          department: "Finance",
          children: [
            { id: 13, name: "Anna Taylor", role: "Accountant", department: "Finance" }
          ]
        }
      ]
    }
  ]
}

function OrgNode({ node, level = 0, isExpanded, onToggle }) {
  const hasChildren = node.children && node.children.length > 0
  const isExpandedNode = isExpanded[node.id] || level === 0

  const getRoleIcon = (role) => {
    if (role === 'CEO') return <Crown className="h-4 w-4 text-yellow-600" />
    if (role.includes('Director') || role.includes('Manager')) return <Shield className="h-4 w-4 text-blue-600" />
    return <User className="h-4 w-4 text-gray-600" />
  }

  const getRoleColor = (role) => {
    if (role === 'CEO') return 'bg-yellow-100 border-yellow-300'
    if (role.includes('Director')) return 'bg-purple-100 border-purple-300'
    if (role.includes('Manager')) return 'bg-blue-100 border-blue-300'
    return 'bg-gray-100 border-gray-300'
  }

  return (
    <div className="relative">
      <div 
        className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getRoleColor(node.role)}`}
        style={{ marginLeft: `${level * 2}rem` }}
      >
        {hasChildren && (
          <button
            onClick={() => onToggle(node.id)}
            className="p-1 hover:bg-white/50 rounded"
          >
            {isExpandedNode ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
        
        <div className="flex items-center space-x-2 flex-1">
          {getRoleIcon(node.role)}
          <div>
            <div className="font-medium text-secondary-900">{node.name}</div>
            <div className="text-sm text-secondary-600">{node.role}</div>
            {node.department && (
              <div className="text-xs text-secondary-500">{node.department}</div>
            )}
          </div>
        </div>
      </div>

      {hasChildren && isExpandedNode && (
        <div className="mt-2 space-y-2">
          {node.children.map((child) => (
            <OrgNode
              key={child.id}
              node={child}
              level={level + 1}
              isExpanded={isExpanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrgChart() {
  const [expandedNodes, setExpandedNodes] = useState({})

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }))
  }

  const expandAll = () => {
    const expandNode = (node) => {
      const newExpanded = { ...expandedNodes }
      if (node.children) {
        newExpanded[node.id] = true
        node.children.forEach(child => {
          Object.assign(newExpanded, expandNode(child))
        })
      }
      return newExpanded
    }
    setExpandedNodes(expandNode(orgData))
  }

  const collapseAll = () => {
    setExpandedNodes({})
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Organization Chart</h1>
          <p className="text-secondary-600">GenZFlow - Where teams flow together</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={expandAll}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 bg-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-300 transition"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Users className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-secondary-900">Company Structure</h2>
        </div>
        
        <div className="space-y-2">
          <OrgNode
            node={orgData}
            isExpanded={expandedNodes}
            onToggle={toggleNode}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Department Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Engineering</span>
              <span className="font-medium">5 members</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Product</span>
              <span className="font-medium">3 members</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Human Resources</span>
              <span className="font-medium">2 members</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Finance</span>
              <span className="font-medium">2 members</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Role Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Directors</span>
              <span className="font-medium">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Managers</span>
              <span className="font-medium">4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Individual Contributors</span>
              <span className="font-medium">7</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Total Employees</span>
              <span className="font-medium">13</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Departments</span>
              <span className="font-medium">4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Reporting Levels</span>
              <span className="font-medium">4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
