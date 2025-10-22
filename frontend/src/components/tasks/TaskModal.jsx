import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X, Calendar, User, Flag, FileText } from 'lucide-react'

export default function TaskModal({ task, onClose, onSave }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'Not Started',
      priority: task?.priority || 'Medium',
      assignedTo: task?.assignedTo || '',
      assignedBy: task?.assignedBy || '',
      project: task?.project || '',
      dueDate: task?.dueDate || '',
      progress: task?.progress || 0
    }
  })

  const watchedProgress = watch('progress')

  useEffect(() => {
    if (watchedProgress === 100) {
      setValue('status', 'Completed')
    } else if (watchedProgress > 0) {
      setValue('status', 'In Progress')
    } else {
      setValue('status', 'Not Started')
    }
  }, [watchedProgress, setValue])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await onSave(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  const mockEmployees = [
    'John Developer',
    'Emma Wilson', 
    'Alex Rivera',
    'David Kim',
    'Sophie Brown',
    'Mike Chen',
    'Sarah Manager',
    'Lisa Park'
  ]

  const mockProjects = [
    'Mobile App',
    'Backend API',
    'Web Dashboard',
    'Data Analytics',
    'Security Audit'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-secondary-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-secondary-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-secondary-700">Task Title *</label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter task title"
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-secondary-700">Priority *</label>
              <select
                {...register('priority', { required: 'Priority is required' })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
              {errors.priority && <p className="text-red-500 text-xs">{errors.priority.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-secondary-700">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Describe the task in detail"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-secondary-700">Assigned To *</label>
              <select
                {...register('assignedTo', { required: 'Assignee is required' })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select assignee</option>
                {mockEmployees.map(employee => (
                  <option key={employee} value={employee}>{employee}</option>
                ))}
              </select>
              {errors.assignedTo && <p className="text-red-500 text-xs">{errors.assignedTo.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-secondary-700">Assigned By</label>
              <select
                {...register('assignedBy')}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select assigner</option>
                {mockEmployees.map(employee => (
                  <option key={employee} value={employee}>{employee}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-secondary-700">Project</label>
              <select
                {...register('project')}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select project</option>
                {mockProjects.map(project => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-secondary-700">Due Date</label>
              <input
                type="date"
                {...register('dueDate')}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-secondary-700">Progress: {watchedProgress}%</label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              {...register('progress')}
              className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-secondary-500">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-secondary-700 bg-secondary-100 rounded-lg hover:bg-secondary-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
