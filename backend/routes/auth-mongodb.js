const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const Employee = require('../models/Employee')
const Department = require('../models/Department')
const { authenticateToken, requireRole } = require('../middleware/auth')

const router = express.Router()

// Register new employee (ADMIN ONLY)
router.post('/register', authenticateToken, requireRole(['CEO', 'Director', 'HR']), [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['CEO', 'Director', 'HR', 'Manager', 'Team Lead', 'Developer']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { name, email, password, role, department_id, manager_id } = req.body

    // Check if email already exists
    const existingUser = await Employee.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      })
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create new employee
    const user = await Employee.create({
      name,
      email,
      password_hash: passwordHash,
      role,
      department_id: department_id || null,
      manager_id: manager_id || null,
      join_date: new Date()
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.status(201).json({
      success: true,
      message: 'Employee registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department_id: user.department_id,
          manager_id: user.manager_id
        },
        token
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Login employee
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { email, password } = req.body

    // Get user from database
    const user = await Employee.findOne({ email })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department_id: user.department_id,
          manager_id: user.manager_id,
          password_change_required: user.password_change_required || false
        },
        token
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await Employee.findById(req.user.id)
      .populate('department_id', 'name')
      .populate('manager_id', 'name')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department_id: user.department_id?._id,
        department_name: user.department_id?.name,
        manager_id: user.manager_id?._id,
        manager_name: user.manager_id?.name,
        profile_picture: user.profile_picture,
        bio: user.bio,
        join_date: user.join_date,
        created_at: user.createdAt,
        password_change_required: user.password_change_required || false
      }
    })

  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Update user profile
router.put('/me', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { name, bio, profile_picture } = req.body
    const updateData = {}

    if (name !== undefined) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (profile_picture !== undefined) updateData.profile_picture = profile_picture

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      })
    }

    const user = await Employee.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).populate('department_id', 'name').populate('manager_id', 'name')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department_id: user.department_id?._id,
        manager_id: user.manager_id?._id,
        profile_picture: user.profile_picture,
        bio: user.bio,
        join_date: user.join_date
      }
    })

  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Change password
router.put('/change-password', authenticateToken, [
  body('currentPassword').optional().notEmpty().withMessage('Current password required (unless first login)'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { currentPassword, newPassword } = req.body

    // Get user
    const user = await Employee.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const isFirstLogin = user.password_change_required

    // Verify current password (skip if password change is required)
    if (!isFirstLogin) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required'
        })
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash)

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        })
      }
    }

    // Hash new password
    const saltRounds = 12
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)

    // Update password and clear password_change_required flag
    await Employee.findByIdAndUpdate(req.user.id, {
      $set: {
        password_hash: newPasswordHash,
        password_change_required: false
      }
    })

    res.json({
      success: true,
      message: isFirstLogin ? 'Password set successfully. You can now use your new password.' : 'Password changed successfully'
    })

  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  })
})

module.exports = router



