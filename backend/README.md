# GenZFlow - Backend

A robust Node.js backend API for GenZFlow - Where all tasks, teams, and time flow together. Built with Express.js, MySQL, and JWT authentication.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (CEO, Director, HR, Manager, Team Lead, Developer)
- **Password hashing** with bcrypt
- **Protected routes** with middleware
- **User profile management**

### 📊 Employee Management
- **CRUD operations** for employee data
- **Organization hierarchy** with manager relationships
- **Department management**
- **Role-based permissions**
- **Employee statistics and analytics**

### ✅ Task Management
- **Full task lifecycle** (Create, Read, Update, Delete)
- **Task assignment** and tracking
- **Progress monitoring** with visual indicators
- **Priority levels** (Low, Medium, High, Urgent)
- **Status management** (Not Started, In Progress, Review, Completed, Overdue)
- **Task filtering** and search capabilities

### 📈 Project Management
- **Project creation** and management
- **Budget tracking**
- **Timeline management**
- **Project status** (Planning, Active, On Hold, Completed, Cancelled)
- **Task-to-project** relationships

### 📊 Dashboard Analytics
- **Role-based dashboards** (CEO, Manager, Employee)
- **Real-time statistics**
- **Performance metrics**
- **Department analytics**
- **Project progress tracking**

### 🛡️ Security Features
- **Helmet.js** for security headers
- **CORS** configuration
- **Rate limiting** to prevent abuse
- **Input validation** with express-validator
- **SQL injection** protection with parameterized queries
- **Password strength** requirements

## 🛠️ Tech Stack

- **Node.js** with Express.js framework
- **MySQL** database with mysql2 driver
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **Helmet** for security
- **CORS** for cross-origin requests
- **Morgan** for request logging

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=sadhu_company_db
   DB_PORT=3306
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Database setup:**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE genzflow_db;
   
   # Import schema
   mysql -u root -p genzflow_db < database/schema.sql
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Production start:**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection and utilities
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── employees.js         # Employee management routes
│   ├── tasks.js             # Task management routes
│   ├── projects.js          # Project management routes
│   └── dashboard.js         # Dashboard analytics routes
├── database/
│   └── schema.sql           # Database schema and sample data
├── server.js                # Main server file
├── package.json             # Dependencies and scripts
├── env.example              # Environment variables template
└── README.md                # This file
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new employee
- `POST /api/auth/login` - Employee login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Employees
- `GET /api/employees` - Get all employees (with filtering)
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Create new employee (Admin only)
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Deactivate employee (Admin only)
- `GET /api/employees/org-chart/hierarchy` - Get organization chart
- `GET /api/employees/stats/overview` - Get employee statistics

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)
- `GET /api/tasks/stats/overview` - Get task statistics

### Projects
- `GET /api/projects` - Get all projects (with filtering)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project (Admin only)
- `GET /api/projects/stats/overview` - Get project statistics

### Dashboard
- `GET /api/dashboard/ceo` - CEO dashboard data
- `GET /api/dashboard/manager` - Manager dashboard data
- `GET /api/dashboard/employee` - Employee dashboard data
- `GET /api/dashboard/general` - General dashboard data

## 🔒 Security Features

### Authentication
- JWT tokens with configurable expiration
- Password hashing with bcrypt (12 salt rounds)
- Role-based access control
- Protected route middleware

### Input Validation
- Request body validation with express-validator
- SQL injection protection with parameterized queries
- XSS protection with input sanitization
- File upload restrictions

### Rate Limiting
- Configurable rate limiting per IP
- Different limits for different endpoints
- Protection against brute force attacks

### CORS Configuration
- Configurable allowed origins
- Credential support for authenticated requests
- Security headers with Helmet.js

## 📊 Database Schema

### Core Tables
- **employees** - Employee information and hierarchy
- **departments** - Department structure
- **projects** - Project management
- **tasks** - Task tracking and assignment
- **meetings** - Meeting scheduling
- **notifications** - System notifications

### Relationships
- Employees have managers (self-referencing)
- Tasks belong to projects and employees
- Projects have creators and tasks
- Meetings have hosts and attendees

## 🚀 Deployment

### Hostinger Deployment

1. **Prepare for production:**
   ```bash
   npm run build  # If you have build scripts
   ```

2. **Upload to Hostinger:**
   - Upload all backend files to your Hostinger hosting
   - Set up Node.js hosting in Hostinger control panel
   - Configure environment variables in Hostinger

3. **Database setup:**
   - Create MySQL database in Hostinger control panel
   - Import schema: `mysql -u username -p database_name < database/schema.sql`
   - Update connection strings in your environment

4. **Environment variables:**
   ```env
   NODE_ENV=production
   DB_HOST=your_hostinger_mysql_host
   DB_USER=your_hostinger_mysql_user
   DB_PASSWORD=your_hostinger_mysql_password
   DB_NAME=your_hostinger_database_name
   JWT_SECRET=your_production_jwt_secret
   FRONTEND_URL=https://yourdomain.com
   ```

### Environment Configuration

**Development:**
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
FRONTEND_URL=http://localhost:5173
```

**Production:**
```env
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
FRONTEND_URL=https://yourdomain.com
```

## 🔧 Configuration

### Database Connection
- Connection pooling for better performance
- Automatic reconnection on connection loss
- Transaction support for data integrity
- Query timeout configuration

### JWT Configuration
- Configurable secret key
- Token expiration settings
- Role-based claims
- Secure token generation

### Rate Limiting
- Window-based rate limiting
- Different limits for different endpoints
- IP-based tracking
- Configurable limits

## 📝 API Documentation

### Request/Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

### Authentication Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Pagination
```
GET /api/endpoint?page=1&limit=20
```

### Filtering
```
GET /api/tasks?status=In Progress&priority=High&assigned_to=123
```

## 🧪 Testing

### Manual Testing
- Use Postman or similar tools
- Test all endpoints with different roles
- Verify authentication and authorization
- Test error scenarios

### Database Testing
- Verify all CRUD operations
- Test relationships and constraints
- Check data integrity
- Performance testing with large datasets

## 🔄 Integration with Frontend

The backend is designed to work seamlessly with the React frontend:

1. **CORS** configured for frontend domain
2. **JWT tokens** for authentication
3. **RESTful API** design
4. **Error handling** with proper HTTP status codes
5. **Data validation** on both ends

## 📈 Performance Considerations

- **Database indexing** for faster queries
- **Connection pooling** for better resource management
- **Query optimization** with proper JOINs
- **Pagination** for large datasets
- **Caching** strategies for frequently accessed data

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection:**
   - Check MySQL service is running
   - Verify connection credentials
   - Ensure database exists

2. **JWT Issues:**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate token format

3. **CORS Errors:**
   - Check FRONTEND_URL configuration
   - Verify allowed origins
   - Test with different browsers

4. **Rate Limiting:**
   - Adjust rate limit settings
   - Check IP whitelisting
   - Monitor request patterns

## 📞 Support

For issues and questions:
- Check the logs for error details
- Verify environment configuration
- Test with sample data
- Review API documentation

## 🔄 Next Steps

1. **Add real-time features** with WebSocket
2. **Implement file uploads** for documents
3. **Add email notifications** for task assignments
4. **Create mobile API** endpoints
5. **Add advanced analytics** and reporting
