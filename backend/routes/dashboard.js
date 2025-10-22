const express = require('express')
const { query } = require('../config/database')
const { authenticateToken, requireRole } = require('../middleware/auth')

const router = express.Router()

// Get CEO dashboard data
router.get('/ceo', authenticateToken, requireRole(['CEO']), async (req, res) => {
  try {
    // Company statistics
    const companyStats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM employees WHERE is_active = TRUE) as total_employees,
        (SELECT COUNT(*) FROM projects WHERE status = 'Active') as active_projects,
        (SELECT COUNT(*) FROM tasks WHERE status = 'Completed' AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as completed_tasks_this_month,
        (SELECT COUNT(*) FROM tasks WHERE status IN ('Not Started', 'In Progress', 'Review')) as pending_tasks
    `)

    // Department performance
    const departmentPerformance = await query(`
      SELECT 
        d.name as department,
        COUNT(e.id) as employee_count,
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
        ROUND(
          (SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) / NULLIF(COUNT(t.id), 0)) * 100, 2
        ) as completion_rate
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id AND e.is_active = TRUE
      LEFT JOIN tasks t ON e.id = t.assigned_to
      GROUP BY d.id, d.name
      HAVING employee_count > 0
      ORDER BY completion_rate DESC
    `)

    // Recent activities
    const recentActivities = await query(`
      SELECT 
        'task_completed' as type,
        e.name as employee_name,
        t.title as task_title,
        t.updated_at as timestamp
      FROM tasks t
      JOIN employees e ON t.assigned_to = e.id
      WHERE t.status = 'Completed' AND t.updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      
      UNION ALL
      
      SELECT 
        'project_created' as type,
        e.name as employee_name,
        p.name as project_title,
        p.created_at as timestamp
      FROM projects p
      JOIN employees e ON p.created_by = e.id
      WHERE p.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      
      ORDER BY timestamp DESC
      LIMIT 10
    `)

    // Project status overview
    const projectStatus = await query(`
      SELECT 
        status,
        COUNT(*) as count,
        SUM(budget) as total_budget
      FROM projects
      GROUP BY status
      ORDER BY count DESC
    `)

    res.json({
      success: true,
      data: {
        company_stats: companyStats[0],
        department_performance: departmentPerformance,
        recent_activities: recentActivities,
        project_status: projectStatus
      }
    })

  } catch (error) {
    console.error('Get CEO dashboard error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get CEO dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Get Manager dashboard data
router.get('/manager', authenticateToken, requireRole(['Director', 'Manager', 'Team Lead']), async (req, res) => {
  try {
    const userId = req.user.id

    // Team statistics
    const teamStats = await query(`
      SELECT 
        COUNT(DISTINCT e.id) as team_members,
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN t.status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        AVG(t.progress) as average_progress
      FROM employees e
      LEFT JOIN tasks t ON e.id = t.assigned_to
      WHERE e.manager_id = ? OR e.id = ?
    `, [userId, userId])

    // Team performance
    const teamPerformance = await query(`
      SELECT 
        e.id,
        e.name,
        e.role,
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
        ROUND(
          (SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) / NULLIF(COUNT(t.id), 0)) * 100, 2
        ) as completion_rate,
        AVG(t.progress) as average_progress
      FROM employees e
      LEFT JOIN tasks t ON e.id = t.assigned_to
      WHERE e.manager_id = ? OR e.id = ?
      GROUP BY e.id, e.name, e.role
      ORDER BY completion_rate DESC
    `, [userId, userId])

    // Upcoming deadlines
    const upcomingDeadlines = await query(`
      SELECT 
        t.id,
        t.title,
        t.deadline,
        t.priority,
        t.status,
        e.name as assigned_to,
        p.name as project_name,
        DATEDIFF(t.deadline, CURDATE()) as days_remaining
      FROM tasks t
      JOIN employees e ON t.assigned_to = e.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE (e.manager_id = ? OR e.id = ?) 
        AND t.deadline IS NOT NULL 
        AND t.status != 'Completed'
        AND t.deadline >= CURDATE()
      ORDER BY t.deadline ASC
      LIMIT 10
    `, [userId, userId])

    // Team workload distribution
    const workloadDistribution = await query(`
      SELECT 
        e.name,
        COUNT(t.id) as task_count,
        SUM(CASE WHEN t.priority = 'Urgent' THEN 1 ELSE 0 END) as urgent_tasks,
        SUM(CASE WHEN t.priority = 'High' THEN 1 ELSE 0 END) as high_priority_tasks
      FROM employees e
      LEFT JOIN tasks t ON e.id = t.assigned_to AND t.status != 'Completed'
      WHERE e.manager_id = ? OR e.id = ?
      GROUP BY e.id, e.name
      ORDER BY task_count DESC
    `, [userId, userId])

    res.json({
      success: true,
      data: {
        team_stats: teamStats[0],
        team_performance: teamPerformance,
        upcoming_deadlines: upcomingDeadlines,
        workload_distribution: workloadDistribution
      }
    })

  } catch (error) {
    console.error('Get Manager dashboard error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get Manager dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Get Employee dashboard data
router.get('/employee', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    // Personal statistics
    const personalStats = await query(`
      SELECT 
        COUNT(t.id) as total_tasks,
        SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) as completed_tasks,
        SUM(CASE WHEN t.status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_tasks,
        SUM(CASE WHEN t.status = 'Not Started' THEN 1 ELSE 0 END) as not_started_tasks,
        AVG(t.progress) as average_progress,
        SUM(CASE WHEN t.deadline < CURDATE() AND t.status != 'Completed' THEN 1 ELSE 0 END) as overdue_tasks
      FROM tasks t
      WHERE t.assigned_to = ?
    `, [userId])

    // My tasks
    const myTasks = await query(`
      SELECT 
        t.id,
        t.title,
        t.status,
        t.priority,
        t.progress,
        t.deadline,
        p.name as project_name,
        DATEDIFF(t.deadline, CURDATE()) as days_remaining
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.assigned_to = ?
      ORDER BY 
        CASE t.priority 
          WHEN 'Urgent' THEN 1 
          WHEN 'High' THEN 2 
          WHEN 'Medium' THEN 3 
          WHEN 'Low' THEN 4 
        END,
        t.deadline ASC
      LIMIT 10
    `, [userId])

    // Performance metrics
    const performanceMetrics = await query(`
      SELECT 
        'Task Completion Rate' as metric,
        ROUND(
          (SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) / NULLIF(COUNT(t.id), 0)) * 100, 2
        ) as value
      FROM tasks t
      WHERE t.assigned_to = ?
      
      UNION ALL
      
      SELECT 
        'On-time Delivery' as metric,
        ROUND(
          (SUM(CASE WHEN t.status = 'Completed' AND t.deadline >= t.updated_at THEN 1 ELSE 0 END) / 
           NULLIF(SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END), 0)) * 100, 2
        ) as value
      FROM tasks t
      WHERE t.assigned_to = ?
      
      UNION ALL
      
      SELECT 
        'Average Progress' as metric,
        ROUND(AVG(t.progress), 2) as value
      FROM tasks t
      WHERE t.assigned_to = ?
    `, [userId, userId, userId])

    // Recent activity
    const recentActivity = await query(`
      SELECT 
        'task_updated' as type,
        t.title as task_title,
        t.status as new_status,
        t.updated_at as timestamp
      FROM tasks t
      WHERE t.assigned_to = ? AND t.updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      
      ORDER BY timestamp DESC
      LIMIT 5
    `, [userId])

    res.json({
      success: true,
      data: {
        personal_stats: personalStats[0],
        my_tasks: myTasks,
        performance_metrics: performanceMetrics,
        recent_activity: recentActivity
      }
    })

  } catch (error) {
    console.error('Get Employee dashboard error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get Employee dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Get general dashboard data (for any role)
router.get('/general', authenticateToken, async (req, res) => {
  try {
    // Basic company stats
    const basicStats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM employees WHERE is_active = TRUE) as total_employees,
        (SELECT COUNT(*) FROM projects WHERE status = 'Active') as active_projects,
        (SELECT COUNT(*) FROM tasks WHERE status = 'Completed' AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as completed_tasks_this_month,
        (SELECT COUNT(*) FROM tasks WHERE status IN ('Not Started', 'In Progress', 'Review')) as pending_tasks
    `)

    // Recent tasks
    const recentTasks = await query(`
      SELECT 
        t.id,
        t.title,
        t.status,
        t.priority,
        t.created_at,
        e.name as assigned_to,
        p.name as project_name
      FROM tasks t
      JOIN employees e ON t.assigned_to = e.id
      LEFT JOIN projects p ON t.project_id = p.id
      ORDER BY t.created_at DESC
      LIMIT 5
    `)

    // Project status summary
    const projectSummary = await query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM projects
      GROUP BY status
      ORDER BY count DESC
    `)

    res.json({
      success: true,
      data: {
        basic_stats: basicStats[0],
        recent_tasks: recentTasks,
        project_summary: projectSummary
      }
    })

  } catch (error) {
    console.error('Get general dashboard error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to get general dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

module.exports = router
