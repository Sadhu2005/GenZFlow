const express = require('express')
const { body, validationResult, query: queryValidator } = require('express-validator')
const { query } = require('../config/database')
const { authenticateToken, requireRole, requireOwnershipOrAdmin } = require('../middleware/auth')

const router = express.Router()

// Get all employees with filtering and pagination
router.get('/', authenticateToken, [
  queryValidator('role').optional().isIn(['CEO', 'Director', 'HR', 'Manager', 'Team Lead', 'Developer']),
  queryValidator('department_id').optional().isInt(),
  queryValidator('page').optional().isInt({ min: 1 }),
  queryValidator('limit').optional().isInt({ min: 1, max: 100 })
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

    const {
      role,
      department_id,
      search,
      page = 1,
      limit = 20
    } = req.query

    // Build WHERE clause
    let whereConditions = ['e.is_active = TRUE']
    let queryParams = []

    if (role) {
      whereConditions.push('e.role = ?')
      queryParams.push(role)
    }

    if (department_id) {
      whereConditions.push('e.department_id = ?')
      queryParams.push(department_id)
    }

    if (search) {
      whereConditions.push('(e.name LIKE ? OR e.email LIKE ?)')
      queryParams.push(`%${search}%`, `%${search}%`)
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN employees m ON e.manager_id = m.id
      ${whereClause}
    `
    const countResult = await query(countQuery, queryParams)
    const total = countResult[0].total

    // Get employees with pagination
    const offset = (page - 1) * limit
    const employeesQuery = `
      SELECT e.id, e.name, e.email, e.role, e.department_id, e.manager_id,
             e.profile_picture, e.bio, e.join_date, e.created_at,
             d.name as department_name,
             m.name as manager_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN employees m ON e.manager_id = m.id
      ${whereClause}
      ORDER BY e.name ASC
      LIMIT ? OFFSET ?
    `

    const employees = await query(employeesQuery, [...queryParams, parseInt(limit), offset])

    res.json({
      success: true,
      data: {
        employees,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get employees error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get employees',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Get single employee
router.get('/:id', authenticateToken, requireOwnershipOrAdmin, async (req, res) => {
  try {
    const employeeId = req.params.id

    const employees = await query(`
      SELECT e.id, e.name, e.email, e.role, e.department_id, e.manager_id,
             e.profile_picture, e.bio, e.join_date, e.created_at,
             d.name as department_name,
             m.name as manager_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN employees m ON e.manager_id = m.id
      WHERE e.id = ? AND e.is_active = TRUE
    `, [employeeId])

    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      })
    }

    res.json({
      success: true,
      data: employees[0]
    })

  } catch (error) {
    console.error('Get employee error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get employee',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Create new employee (Admin only)
router.post('/', authenticateToken, requireRole(['CEO', 'Director', 'HR']), [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['CEO', 'Director', 'HR', 'Manager', 'Team Lead', 'Developer']).withMessage('Invalid role'),
  body('department_id').optional().isInt().withMessage('Invalid department ID'),
  body('manager_id').optional().isInt().withMessage('Invalid manager ID')
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

    const { name, email, password, role, department_id, manager_id, bio } = req.body

    // Check if email already exists
    const existingUsers = await query(
      'SELECT id FROM employees WHERE email = ?',
      [email]
    )

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      })
    }

    // Hash password
    const bcrypt = require('bcryptjs')
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Insert new employee
    const result = await query(
      'INSERT INTO employees (name, email, password_hash, role, department_id, manager_id, bio, join_date) VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())',
      [name, email, passwordHash, role, department_id || null, manager_id || null, bio || null]
    )

    const newUserId = result.insertId

    // Get the created user
    const users = await query(`
      SELECT e.id, e.name, e.email, e.role, e.department_id, e.manager_id,
             e.profile_picture, e.bio, e.join_date, e.created_at,
             d.name as department_name,
             m.name as manager_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN employees m ON e.manager_id = m.id
      WHERE e.id = ?
    `, [newUserId])

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: users[0]
    })

  } catch (error) {
    console.error('Create employee error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create employee',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Update employee
router.put('/:id', authenticateToken, requireOwnershipOrAdmin, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('role').optional().isIn(['CEO', 'Director', 'HR', 'Manager', 'Team Lead', 'Developer']).withMessage('Invalid role'),
  body('department_id').optional().isInt().withMessage('Invalid department ID'),
  body('manager_id').optional().isInt().withMessage('Invalid manager ID'),
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

    const employeeId = req.params.id
    const updateData = req.body

    // Check if employee exists
    const employees = await query('SELECT id FROM employees WHERE id = ? AND is_active = TRUE', [employeeId])
    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      })
    }

    // Build update query
    const updateFields = []
    const updateValues = []

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        updateFields.push(`${key} = ?`)
        updateValues.push(updateData[key])
      }
    })

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      })
    }

    updateValues.push(employeeId)

    await query(
      `UPDATE employees SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    )

    // Get updated employee
    const updatedEmployees = await query(`
      SELECT e.id, e.name, e.email, e.role, e.department_id, e.manager_id,
             e.profile_picture, e.bio, e.join_date, e.created_at,
             d.name as department_name,
             m.name as manager_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN employees m ON e.manager_id = m.id
      WHERE e.id = ?
    `, [employeeId])

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployees[0]
    })

  } catch (error) {
    console.error('Update employee error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Deactivate employee (soft delete)
router.delete('/:id', authenticateToken, requireRole(['CEO', 'Director', 'HR']), async (req, res) => {
  try {
    const employeeId = req.params.id

    // Check if employee exists
    const employees = await query('SELECT id FROM employees WHERE id = ? AND is_active = TRUE', [employeeId])
    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      })
    }

    // Prevent self-deletion
    if (parseInt(employeeId) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      })
    }

    // Soft delete (deactivate)
    await query(
      'UPDATE employees SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [employeeId]
    )

    res.json({
      success: true,
      message: 'Employee deactivated successfully'
    })

  } catch (error) {
    console.error('Deactivate employee error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate employee',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Get organization chart
router.get('/org-chart/hierarchy', authenticateToken, async (req, res) => {
  try {
    // Get all employees with their relationships
    const employees = await query(`
      SELECT e.id, e.name, e.role, e.department_id, e.manager_id,
             d.name as department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.is_active = TRUE
      ORDER BY e.role, e.name
    `)

    // Build hierarchy
    const buildHierarchy = (employees, managerId = null) => {
      return employees
        .filter(emp => emp.manager_id === managerId)
        .map(emp => ({
          ...emp,
          children: buildHierarchy(employees, emp.id)
        }))
    }

    const hierarchy = buildHierarchy(employees)

    res.json({
      success: true,
      data: hierarchy
    })

  } catch (error) {
    console.error('Get org chart error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get organization chart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Get employee statistics
router.get('/stats/overview', authenticateToken, requireRole(['CEO', 'Director', 'HR']), async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_employees,
        SUM(CASE WHEN role = 'CEO' THEN 1 ELSE 0 END) as ceo_count,
        SUM(CASE WHEN role = 'Director' THEN 1 ELSE 0 END) as director_count,
        SUM(CASE WHEN role = 'Manager' THEN 1 ELSE 0 END) as manager_count,
        SUM(CASE WHEN role = 'Team Lead' THEN 1 ELSE 0 END) as team_lead_count,
        SUM(CASE WHEN role = 'Developer' THEN 1 ELSE 0 END) as developer_count,
        SUM(CASE WHEN role = 'HR' THEN 1 ELSE 0 END) as hr_count
      FROM employees
      WHERE is_active = TRUE
    `)

    const departmentStats = await query(`
      SELECT d.name as department_name, COUNT(e.id) as employee_count
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id AND e.is_active = TRUE
      GROUP BY d.id, d.name
      ORDER BY employee_count DESC
    `)

    res.json({
      success: true,
      data: {
        overview: stats[0],
        departments: departmentStats
      }
    })

  } catch (error) {
    console.error('Get employee stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get employee statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

module.exports = router
