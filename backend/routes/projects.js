const express = require('express')
const { body, validationResult, query: queryValidator } = require('express-validator')
const { query } = require('../config/database')
const { authenticateToken, requireRole } = require('../middleware/auth')

const router = express.Router()

// Get all projects with filtering and pagination
router.get('/', authenticateToken, [
  queryValidator('status').optional().isIn(['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled']),
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
      status,
      search,
      page = 1,
      limit = 20
    } = req.query

    // Build WHERE clause
    let whereConditions = []
    let queryParams = []

    if (status) {
      whereConditions.push('p.status = ?')
      queryParams.push(status)
    }

    if (search) {
      whereConditions.push('(p.name LIKE ? OR p.description LIKE ?)')
      queryParams.push(`%${search}%`, `%${search}%`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM projects p
      LEFT JOIN employees e ON p.created_by = e.id
      ${whereClause}
    `
    const countResult = await query(countQuery, queryParams)
    const total = countResult[0].total

    // Get projects with pagination
    const offset = (page - 1) * limit
    const projectsQuery = `
      SELECT p.*,
             e.name as created_by_name,
             COUNT(t.id) as task_count,
             SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
             AVG(t.progress) as average_progress
      FROM projects p
      LEFT JOIN employees e ON p.created_by = e.id
      LEFT JOIN tasks t ON p.id = t.project_id
      ${whereClause}
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `

    const projects = await query(projectsQuery, [...queryParams, parseInt(limit), offset])

    res.json({
      success: true,
      data: {
        projects,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get projects',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Get single project
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id

    const projects = await query(`
      SELECT p.*,
             e.name as created_by_name,
             COUNT(t.id) as task_count,
             SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
             AVG(t.progress) as average_progress
      FROM projects p
      LEFT JOIN employees e ON p.created_by = e.id
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [projectId])

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      })
    }

    // Get project tasks
    const tasks = await query(`
      SELECT t.*,
             e.name as assigned_to_name,
             a.name as assigned_by_name
      FROM tasks t
      LEFT JOIN employees e ON t.assigned_to = e.id
      LEFT JOIN employees a ON t.assigned_by = a.id
      WHERE t.project_id = ?
      ORDER BY t.created_at DESC
    `, [projectId])

    const project = projects[0]
    project.tasks = tasks

    res.json({
      success: true,
      data: project
    })

  } catch (error) {
    console.error('Get project error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get project',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Create new project
router.post('/', authenticateToken, requireRole(['CEO', 'Director', 'Manager']), [
  body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Project name is required and must be less than 200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('start_date').optional().isISO8601().withMessage('Invalid start date format'),
  body('deadline').optional().isISO8601().withMessage('Invalid deadline format'),
  body('budget').optional().isDecimal().withMessage('Invalid budget format')
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
      name,
      description,
      start_date,
      deadline,
      budget
    } = req.body

    // Create project
    const result = await query(`
      INSERT INTO projects (name, description, start_date, deadline, budget, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, description, start_date || null, deadline || null, budget || null, req.user.id])

    const projectId = result.insertId

    // Get created project
    const projects = await query(`
      SELECT p.*,
             e.name as created_by_name
      FROM projects p
      LEFT JOIN employees e ON p.created_by = e.id
      WHERE p.id = ?
    `, [projectId])

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: projects[0]
    })

  } catch (error) {
    console.error('Create project error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Update project
router.put('/:id', authenticateToken, requireRole(['CEO', 'Director', 'Manager']), [
  body('name').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Project name must be less than 200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('status').optional().isIn(['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled']).withMessage('Invalid status'),
  body('start_date').optional().isISO8601().withMessage('Invalid start date format'),
  body('deadline').optional().isISO8601().withMessage('Invalid deadline format'),
  body('budget').optional().isDecimal().withMessage('Invalid budget format')
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

    const projectId = req.params.id
    const updateData = req.body

    // Check if project exists
    const projects = await query('SELECT id FROM projects WHERE id = ?', [projectId])
    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
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

    updateValues.push(projectId)

    await query(
      `UPDATE projects SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    )

    // Get updated project
    const updatedProjects = await query(`
      SELECT p.*,
             e.name as created_by_name,
             COUNT(t.id) as task_count,
             SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
             AVG(t.progress) as average_progress
      FROM projects p
      LEFT JOIN employees e ON p.created_by = e.id
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [projectId])

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProjects[0]
    })

  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Delete project
router.delete('/:id', authenticateToken, requireRole(['CEO', 'Director']), async (req, res) => {
  try {
    const projectId = req.params.id

    // Check if project exists
    const projects = await query('SELECT id FROM projects WHERE id = ?', [projectId])
    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      })
    }

    // Check if project has tasks
    const tasks = await query('SELECT COUNT(*) as task_count FROM tasks WHERE project_id = ?', [projectId])
    if (tasks[0].task_count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete project with existing tasks. Please reassign or delete tasks first.'
      })
    }

    // Delete project
    await query('DELETE FROM projects WHERE id = ?', [projectId])

    res.json({
      success: true,
      message: 'Project deleted successfully'
    })

  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Get project statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_projects,
        SUM(CASE WHEN status = 'Planning' THEN 1 ELSE 0 END) as planning_projects,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_projects,
        SUM(CASE WHEN status = 'On Hold' THEN 1 ELSE 0 END) as on_hold_projects,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_projects,
        SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled_projects,
        SUM(budget) as total_budget,
        AVG(budget) as average_budget
      FROM projects
    `)

    const projectProgress = await query(`
      SELECT p.id, p.name, p.status,
             COUNT(t.id) as total_tasks,
             SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
             AVG(t.progress) as average_progress
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      GROUP BY p.id, p.name, p.status
      ORDER BY average_progress DESC
    `)

    res.json({
      success: true,
      data: {
        overview: stats[0],
        project_progress: projectProgress
      }
    })

  } catch (error) {
    console.error('Get project stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get project statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

module.exports = router
