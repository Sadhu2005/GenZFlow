# 🌊 GenZFlow
**Where all tasks, teams, and time flow together.**

A modern, comprehensive company management platform designed for the next generation of work. GenZFlow streamlines your entire workflow with intuitive task management, team collaboration, and real-time analytics.

## ✨ **What is GenZFlow?**

GenZFlow is a complete company management solution that brings together:
- 📋 **Task Management** - Seamless task creation, assignment, and tracking
- 👥 **Team Collaboration** - Interactive org charts and team management
- 📊 **Analytics Dashboard** - Role-based insights and performance metrics
- 🔐 **Secure Authentication** - JWT-based security with role permissions
- 🎯 **Project Management** - End-to-end project lifecycle tracking

## 🚀 **Key Features**

### **For CEOs & Executives**
- Company-wide performance metrics
- Department analytics and insights
- Strategic project overview
- Real-time business intelligence

### **For Managers & Team Leads**
- Team performance tracking
- Task assignment and monitoring
- Workload distribution analysis
- Upcoming deadline management

### **For Employees**
- Personal task dashboard
- Progress tracking and reporting
- Team collaboration tools
- Performance insights

## 🛠️ **Tech Stack**

### **Frontend**
- ⚛️ **React 18** with modern hooks
- 🎨 **Tailwind CSS** for beautiful, responsive design
- ⚡ **Vite** for lightning-fast development
- 🧭 **React Router** for seamless navigation
- 📱 **Fully Responsive** - works on all devices

### **Backend**
- 🟢 **Node.js** with Express.js framework
- 🗄️ **MySQL** database with optimized schema
- 🔐 **JWT Authentication** with role-based access
- 🛡️ **Security First** - Helmet, CORS, Rate limiting
- 📊 **RESTful API** with comprehensive endpoints

## 🚀 **Quick Start**

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/genzflow.git
cd genzflow
```

### **2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
**Access:** http://localhost:5173

### **3. Backend Setup**
```bash
cd backend
npm install
cp env.example .env
# Update .env with your MySQL credentials
npm run dev
```
**Access:** http://localhost:5000

### **4. Database Setup**
```bash
# Create database
mysql -u root -p
CREATE DATABASE genzflow_db;

# Import schema
mysql -u root -p genzflow_db < backend/database/schema.sql
```

## 📁 **Project Structure**

```
genzflow/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context providers
│   │   └── styles/         # Tailwind CSS styles
│   └── package.json
├── backend/                 # Node.js API
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & validation
│   ├── config/            # Database configuration
│   ├── database/          # SQL schema and migrations
│   └── package.json
└── README.md              # This file
```

## 🎯 **Core Features**

### **🔐 Authentication System**
- User registration with role selection
- Secure JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (CEO, Director, Manager, Developer)

### **📋 Task Management**
- Create, assign, and track tasks
- Priority levels (Low, Medium, High, Urgent)
- Status tracking (Not Started, In Progress, Completed, Overdue)
- Progress monitoring with visual indicators
- Advanced filtering and search

### **👥 Organization Management**
- Interactive organizational chart
- Employee hierarchy visualization
- Department management
- Manager-employee relationships
- Role-based permissions

### **📊 Analytics Dashboard**
- **CEO Dashboard**: Company-wide metrics and insights
- **Manager Dashboard**: Team performance and workload
- **Employee Dashboard**: Personal tasks and progress
- Real-time statistics and analytics

### **🎨 Modern UI/UX**
- Clean, intuitive interface
- Responsive design for all devices
- Smooth animations and transitions
- Professional color scheme
- Accessibility-focused design

## 🔧 **Configuration**

### **Environment Variables**
```env
# Database
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=genzflow_db

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🚀 **Deployment**

### **Frontend (Hostinger)**
1. Build the project: `npm run build`
2. Upload `dist/` folder to Hostinger File Manager
3. Configure domain to point to uploaded files

### **Backend (Hostinger)**
1. Upload backend files to Hostinger
2. Set up Node.js hosting in control panel
3. Configure environment variables
4. Import database schema

### **Database (Hostinger MySQL)**
1. Create MySQL database in Hostinger
2. Import the provided schema
3. Update connection strings

## 📊 **API Endpoints**

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/me` - Update profile

### **Tasks**
- `GET /api/tasks` - Get all tasks (with filtering)
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### **Employees**
- `GET /api/employees` - Get all employees
- `GET /api/employees/org-chart/hierarchy` - Get org chart
- `POST /api/employees` - Create employee (Admin)

### **Projects**
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project

### **Dashboard**
- `GET /api/dashboard/ceo` - CEO analytics
- `GET /api/dashboard/manager` - Manager analytics
- `GET /api/dashboard/employee` - Employee analytics

## 🎨 **Design Philosophy**

GenZFlow is built with modern design principles:
- **Flow-based UX** - Intuitive, seamless user experience
- **Mobile-first** - Responsive design for all devices
- **Accessibility** - Inclusive design for all users
- **Performance** - Fast, efficient, and scalable
- **Security** - Enterprise-grade security features

## 🔒 **Security Features**

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection protection
- XSS protection
- CORS configuration
- Rate limiting
- Input validation
- Role-based access control

## 📈 **Performance**

- Database indexing for fast queries
- Connection pooling for efficiency
- Optimized React components
- Lazy loading and code splitting
- Caching strategies
- Responsive image loading

## 🤝 **Contributing**

We welcome contributions! Please see our contributing guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

- 📧 **Email**: support@genzflow.com
- 📚 **Documentation**: [docs.genzflow.com](https://docs.genzflow.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/genzflow/issues)
- 💬 **Community**: [Discord Server](https://discord.gg/genzflow)

## 🌟 **Why GenZFlow?**

- **Modern**: Built for the next generation of work
- **Intuitive**: Easy to use, hard to put down
- **Scalable**: Grows with your company
- **Secure**: Enterprise-grade security
- **Fast**: Lightning-fast performance
- **Beautiful**: Stunning, professional design

---

**GenZFlow** - Where all tasks, teams, and time flow together. 🌊✨

*Built with ❤️ for the future of work*
