const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    default: null
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  assigned_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Review', 'Completed', 'Overdue'],
    default: 'Not Started'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
    default: null
  },
  estimated_hours: {
    type: Number,
    default: null
  },
  actual_hours: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
})

taskSchema.index({ assigned_to: 1 })
taskSchema.index({ status: 1 })
taskSchema.index({ priority: 1 })
taskSchema.index({ deadline: 1 })
taskSchema.index({ project_id: 1 })

module.exports = mongoose.model('Task', taskSchema)



