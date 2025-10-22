# GenZFlow - Frontend

A modern React-based frontend for GenZFlow - Where all tasks, teams, and time flow together. Built with Vite, Tailwind CSS, and React Router.

## 🚀 Features

### 🔐 Authentication
- **Login/Register** with form validation
- **JWT-based authentication** with demo functionality
- **Protected routes** with automatic redirects
- **Role-based access control**

### 📊 Role-Based Dashboards
- **CEO Dashboard**: Company-wide metrics, department performance
- **Manager Dashboard**: Team metrics, performance tracking
- **Employee Dashboard**: Personal tasks, individual performance

### ✅ Task Management
- **Create, edit, delete tasks** with full CRUD operations
- **Task filtering** by status, priority, and project
- **Progress tracking** with visual progress bars
- **Priority levels** (Low, Medium, High, Urgent)
- **Status management** (Not Started, In Progress, Completed, Overdue)

### 🏢 Organization Chart
- **Interactive org chart** with expand/collapse functionality
- **Role-based icons** and color coding
- **Department overview** and statistics
- **Hierarchical structure** visualization

### 🎨 Modern UI/UX
- **Responsive design** for all screen sizes
- **Tailwind CSS** with custom color scheme
- **Smooth animations** and transitions
- **Professional navigation** with active states

## 🛠️ Tech Stack

- **React 18** with hooks and functional components
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form management
- **React Hot Toast** for notifications
- **Lucide React** for icons
- **Recharts** for data visualization

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── dashboard/          # Role-based dashboard components
│   │   ├── tasks/              # Task management components
│   │   ├── Navbar.jsx          # Navigation component
│   │   └── ProtectedRoute.jsx  # Route protection
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication context
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Tasks.jsx           # Task management page
│   │   └── NotFound.jsx        # 404 page
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles
├── public/
│   └── index.html              # HTML template
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## 🎯 Key Components

### Authentication
- **AuthContext**: Manages user authentication state
- **ProtectedRoute**: Protects routes requiring authentication
- **Login/Register**: User authentication forms

### Dashboards
- **CEODashboard**: Executive-level metrics and insights
- **ManagerDashboard**: Team management and performance
- **EmployeeDashboard**: Personal task and performance tracking

### Task Management
- **TaskCard**: Individual task display with actions
- **TaskModal**: Create/edit task form
- **TaskFilters**: Filter tasks by various criteria

### Organization
- **OrgChart**: Interactive company structure visualization

## 🔧 Configuration

### Tailwind CSS
Custom color scheme and animations are configured in `tailwind.config.js`:
- Primary colors (blue theme)
- Secondary colors (gray theme)
- Custom animations (fade-in, slide-up, bounce-gentle)

### Vite Configuration
Development server runs on port 5173 with auto-open browser.

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to Hostinger or any static hosting service.

### Hostinger Deployment
1. Build the project: `npm run build`
2. Upload the `dist/` folder contents to your Hostinger file manager
3. Configure your domain to point to the uploaded files

## 🔄 Next Steps

This frontend is ready for integration with the backend API. The authentication context includes placeholder functions that can be easily connected to real API endpoints.

**Backend Integration Points:**
- Replace demo authentication with real API calls
- Connect task management to backend CRUD operations
- Integrate with real user and organization data
- Add real-time updates with WebSocket connections

## 📝 Notes

- All authentication is currently demo-based for development
- Task data is stored in component state (will be replaced with API calls)
- Organization chart uses mock data (will be connected to backend)
- Responsive design tested on mobile, tablet, and desktop
