import { Filter } from 'lucide-react'

export default function TaskFilters({ filters, onFiltersChange }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-secondary-500" />
        <span className="text-sm text-secondary-600">Filters:</span>
      </div>
      
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="All">All Status</option>
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="Overdue">Overdue</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => handleFilterChange('priority', e.target.value)}
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="All">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>

      <select
        value={filters.project}
        onChange={(e) => handleFilterChange('project', e.target.value)}
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="All">All Projects</option>
        <option value="Mobile App">Mobile App</option>
        <option value="Backend API">Backend API</option>
        <option value="Web Dashboard">Web Dashboard</option>
        <option value="Data Analytics">Data Analytics</option>
        <option value="Security Audit">Security Audit</option>
      </select>

      <button
        onClick={() => onFiltersChange({ status: 'All', priority: 'All', project: 'All' })}
        className="px-3 py-2 text-sm text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-lg transition"
      >
        Clear All
      </button>
    </div>
  )
}
