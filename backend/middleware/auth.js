const jwt = require('jsonwebtoken')
const Employee = require('../models/Employee')

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Get user details from database
    const user = await Employee.findById(decoded.userId)

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      })
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      department_id: user.department_id,
      manager_id: user.manager_id,
      is_active: user.is_active
    }
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token'
      })
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Token expired'
      })
    }

    console.error('Auth middleware error:', error)
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    })
  }
}

// Check if user has required role(s)
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const userRole = req.user.role
    const allowedRoles = Array.isArray(roles) ? roles : [roles]

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        required: allowedRoles,
        current: userRole
      })
    }

    next()
  }
}

// Check if user is accessing their own data or has admin privileges
const requireOwnershipOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    })
  }

  const userId = req.params.id || req.params.userId
  const isAdmin = ['CEO', 'Director', 'HR'].includes(req.user.role)
  const isOwnData = req.user.id === userId

  if (!isOwnData && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own data.'
    })
  }

  next()
}

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await Employee.findById(decoded.userId)

      if (user && user.is_active) {
        req.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          department_id: user.department_id,
          manager_id: user.manager_id,
          is_active: user.is_active
        }
      }
    }
  } catch (error) {
    // Silently fail for optional auth
    console.log('Optional auth failed:', error.message)
  }

  next()
}

// Rate limiting for sensitive operations
const sensitiveOperationLimit = (req, res, next) => {
  // This would be implemented with a more sophisticated rate limiting
  // For now, we'll use the general rate limiter
  next()
}

module.exports = {
  authenticateToken,
  requireRole,
  requireOwnershipOrAdmin,
  optionalAuth,
  sensitiveOperationLimit
}
