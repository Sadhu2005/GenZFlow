const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['CEO', 'Director', 'HR', 'Manager', 'Team Lead', 'Developer']
  },
  department_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null
  },
  manager_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  profile_picture: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500,
    default: null
  },
  join_date: {
    type: Date,
    default: Date.now
  },
  is_active: {
    type: Boolean,
    default: true
  },
  password_change_required: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Indexes
employeeSchema.index({ email: 1 })
employeeSchema.index({ role: 1 })
employeeSchema.index({ department_id: 1 })
employeeSchema.index({ manager_id: 1 })
employeeSchema.index({ is_active: 1 })

module.exports = mongoose.model('Employee', employeeSchema)



