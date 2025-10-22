const express = require('express')
const { body, validationResult, query: queryValidator } = require('express-validator')
const { query } = require('../config/database')
const { authenticateToken, requireRole, requireOwnershipOrAdmin } = require('../middleware/auth')

const router = express.Router()

// Get all tasks with filtering and pagination
router.get('/', authenticateToken, [
  queryValidator('status').optional().isIn(['Not Started', 'In Progress', 'Review', 'Completed', 'Overdue']),
  queryValidator('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent']),
  queryValidator('assigned_to').optional().isInt(),
  queryValidator('project_id').optional().isInt(),
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
      priority,
      assigned_to,
      project_id,
      search,
      page = 1,
      limit = 20
    } = req.query

    // Build WHERE clause
    let whereConditions = []
    let queryParams = []

    if (status) {
      whereConditions.push('t.status = ?')
      queryParams.push(status)
    }

    if (priority) {
      whereConditions.push('t.priority = ?')
      queryParams.push(priority)
    }

    if (assigned_to) {
      whereConditions.push('t.assigned_to = ?')
      queryParams.push(assigned_to)
    }

    if (project_id) {
      whereConditions.push('t.project_id = ?')
      queryParams.push(project_id)
    }

    if (search) {
      whereConditions.push('(t.title LIKE ? OR t.description LIKE ?)')
      queryParams.push(`%${search}%`, `%${search}%`)
    }

    // Role-based filtering
    if (req.user.role === 'Developer' || req.user.role === 'Team Lead') {
      whereConditions.push('(t.assigned_to = ? OR t.assigned_by = ?)')
      queryParams.push(req.user.id, req.user.id)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM tasks t
      LEFT JOIN employees e ON t.assigned_to = e.id
      LEFT JOIN employees a ON t.assigned_by = a.id
      LEFT JOIN projects p ON t.project_id = p.id
      ${whereClause}
    `
    const countResult = await query(countQuery, queryParams)
    const total = countResult[0].total

    // Get tasks with pagination
    const offset = (page - 1) * limit
    const tasksQuery = `
      SELECT t.*,
             e.name as assigned_to_name,
             e.email as assigned_to_email,
             a.name as assigned_by_name,
             p.name as project_name
      FROM tasks t
      LEFT JOIN employees e ON t.assigned_to = e.id
      LEFT JOIN employees a ON t.assigned_by = a.id
      LEFT JOIN projects p ON t.project_id = p.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `

    const tasks = await query(tasksQuery, [...queryParams, parseInt(limit), offset])

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get tasks error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get tasks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Get single task
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id

    const tasks = await query(`
      SELECT t.*,
             e.name as assigned_to_name,
             e.email as assigned_to_email,
             a.name as assigned_by_name,
             p.name as project_name
      FROM tasks t
      LEFT JOIN employees e ON t.assigned_to = e.id
      LEFT JOIN employees a ON t.assigned_by = a.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = ?
    `, [taskId])

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      })
    }

    const task = tasks[0]

    // Check access permissions
    if (req.user.role === 'Developer' || req.user.role === 'Team Lead') {
      if (task.assigned_to !== req.user.id && task.assigned_by !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        })
      }
    }

    res.json({
      success: true,
      data: task
    })

  } catch (error) {
    console.error('Get task error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Create new task
router.post('/', authenticateToken, requireRole(['CEO', 'Director', 'Manager', 'Team Lead']), [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be less than 200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('assigned_to').isInt().withMessage('Valid assignee required'),
  body('priority').isIn(['Low', 'Medium', 'High', 'Urgent']).withMessage('Invalid priority'),
  body('project_id').optional().isInt().withMessage('Invalid project ID'),
  body('deadline').optional().isISO8601().withMessage('Invalid deadline format')
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
      title,
      description,
      assigned_to,
      priority,
      project_id,
      deadline,
      estimated_hours
    } = req.body

    // Verify assignee exists
    const assignees = await query('SELECT id, name FROM employees WHERE id = ? AND is_active = TRUE', [assigned_to])
    if (assignees.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Assignee not found or inactive'
      })
    }

    // Verify project exists if provided
    if (project_id) {
      const projects = await query('SELECT id FROM projects WHERE id = ?', [project_id])
      if (projects.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Project not found'
        })
      }
    }

    // Create task
    const result = await query(`
      INSERT INTO tasks (title, description, assigned_to, assigned_by, priority, project_id, deadline, estimated_hours, start_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
    `, [title, description, assigned_to, req.user.id, priority, project_id || null, deadline || null, estimated_hours || null])

    const taskId = result.insertId

    // Get created task
    const tasks = await query(`
      SELECT t.*,
             e.name as assigned_to_name,
             e.email as assigned_to_email,
             a.name as assigned_by_name,
             p.name as project_name
      FROM tasks t
      LEFT JOIN employees e ON t.assigned_to = e.id
      LEFT JOIN employees a ON t.assigned_by = a.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = ?
    `, [taskId])

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: tasks[0]
    })

  } catch (error) {
    console.error('Create task error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Update task
router.put('/:id', authenticateToken, [
  body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('status').optional().isIn(['Not Started', 'In Progress', 'Review', 'Completed', 'Overdue']).withMessage('Invalid status'),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Urgent']).withMessage('Invalid priority'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100')
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

    const taskId = req.params.id
    const updateData = req.body

    // Get current task
    const tasks = await query('SELECT * FROM tasks WHERE id = ?', [taskId])
    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      })
    }

    const task = tasks[0]

    // Check permissions
    const canEdit = req.user.role === 'CEO' || 
                   req.user.role === 'Director' || 
                   req.user.role === 'Manager' ||
                   req.user.role === 'Team Lead' ||
                   task.assigned_to === req.user.id ||
                   task.assigned_by === req.user.id

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to edit this task'
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

    updateValues.push(taskId)

    await query(
      `UPDATE tasks SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      updateValues
    )

    // Get updated task
    const updatedTasks = await query(`
      SELECT t.*,
             e.name as assigned_to_name,
             e.email as assigned_to_email,
             a.name as assigned_by_name,
             p.name as project_name
      FROM tasks t
      LEFT JOIN employees e ON t.assigned_to = e.id
      LEFT JOIN employees a ON t.assigned_by = a.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = ?
    `, [taskId])

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTasks[0]
    })

  } catch (error) {
    console.error('Update task error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Delete task
router.delete('/:id', authenticateToken, requireRole(['CEO', 'Director', 'Manager']), async (req, res) => {
  try {
    const taskId = req.params.id

    // Check if task exists
    const tasks = await query('SELECT id FROM tasks WHERE id = ?', [taskId])
    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      })
    }

    // Delete task
    await query('DELETE FROM tasks WHERE id = ?', [taskId])

    res.json({
      success: true,
      message: 'Task deleted successfully'
    })

  } catch (error) {
    console.error('Delete task error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Get task statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    let whereClause = ''
    let queryParams = []

    // Role-based filtering
    if (req.user.role === 'Developer' || req.user.role === 'Team Lead') {
      whereClause = 'WHERE (assigned_to = ? OR assigned_by = ?)'
      queryParams = [req.user.id, req.user.id]
    }

    const stats = await query(`
      SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN status = 'Not Started' THEN 1 ELSE 0 END) as not_started_tasks,
        SUM(CASE WHEN status = 'Overdue' THEN 1 ELSE 0 END) as overdue_tasks,
        SUM(CASE WHEN priority = 'Urgent' THEN 1 ELSE 0 END) as urgent_tasks,
        SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END) as high_priority_tasks,
        AVG(progress) as average_progress
      FROM tasks
      ${whereClause}
    `, queryParams)

    res.json({
      success: true,
      data: stats[0]
    })

  } catch (error) {
    console.error('Get task stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get task statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

module.exports = router
