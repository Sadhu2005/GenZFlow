-- GenZFlow Database Schema
-- Where all tasks, teams, and time flow together
-- MySQL Database Schema for Hostinger

-- Create database (run this first)
-- CREATE DATABASE genzflow_db;
-- USE genzflow_db;

-- Employees table (core of the system)
CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('CEO', 'Director', 'HR', 'Manager', 'Team Lead', 'Developer') NOT NULL,
  department_id INT,
  manager_id INT,
  profile_picture VARCHAR(255),
  bio TEXT,
  join_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- Departments table
CREATE TABLE departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  director_id INT,
  budget DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (director_id) REFERENCES employees(id)
);

-- Add foreign key constraint for employees.department_id
ALTER TABLE employees ADD FOREIGN KEY (department_id) REFERENCES departments(id);

-- Projects table
CREATE TABLE projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  start_date DATE,
  deadline DATE,
  status ENUM('Planning', 'Active', 'On Hold', 'Completed', 'Cancelled') DEFAULT 'Planning',
  budget DECIMAL(15,2),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES employees(id)
);

-- Tasks table
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  project_id INT,
  assigned_to INT,
  assigned_by INT,
  status ENUM('Not Started', 'In Progress', 'Review', 'Completed', 'Overdue') DEFAULT 'Not Started',
  priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
  progress TINYINT DEFAULT 0,
  start_date DATE,
  deadline DATE,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES employees(id),
  FOREIGN KEY (assigned_by) REFERENCES employees(id)
);

-- Meetings table
CREATE TABLE meetings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  host_id INT,
  meeting_date DATE,
  meeting_time TIME,
  duration_minutes INT,
  meeting_link VARCHAR(500),
  meeting_type ENUM('Team Meeting', 'One-on-One', 'Project Review', 'All Hands', 'Other') DEFAULT 'Team Meeting',
  status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (host_id) REFERENCES employees(id)
);

-- Meeting attendees (many-to-many relationship)
CREATE TABLE meeting_attendees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  meeting_id INT,
  employee_id INT,
  attendance_status ENUM('Invited', 'Attending', 'Declined', 'Attended', 'Absent') DEFAULT 'Invited',
  response_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  UNIQUE KEY unique_meeting_attendee (meeting_id, employee_id)
);

-- Task comments table
CREATE TABLE task_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT,
  employee_id INT,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Notifications table
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  type ENUM('Task Assignment', 'Task Update', 'Meeting Invite', 'Project Update', 'System') DEFAULT 'System',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Performance reviews table
CREATE TABLE performance_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT,
  reviewer_id INT,
  review_period_start DATE,
  review_period_end DATE,
  rating DECIMAL(3,2),
  goals_achieved TEXT,
  areas_for_improvement TEXT,
  next_goals TEXT,
  status ENUM('Draft', 'Submitted', 'Approved') DEFAULT 'Draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (reviewer_id) REFERENCES employees(id)
);

-- Create indexes for better performance
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_role ON employees(role);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_meetings_date ON meetings(meeting_date);
CREATE INDEX idx_notifications_employee ON notifications(employee_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Insert sample data
INSERT INTO departments (name, description, budget) VALUES
('Engineering', 'Software development and technical operations', 500000.00),
('Product', 'Product management and design', 200000.00),
('Human Resources', 'Employee relations and recruitment', 150000.00),
('Finance', 'Financial management and accounting', 100000.00);

-- Insert sample CEO
INSERT INTO employees (name, email, password_hash, role, department_id, join_date) VALUES
('GenZFlow', 'ceo@genzflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CEO', 1, '2020-01-01');

-- Insert sample employees
INSERT INTO employees (name, email, password_hash, role, department_id, manager_id, join_date) VALUES
('Sarah Johnson', 'sarah.johnson@genzflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Director', 1, 1, '2020-02-01'),
('Mike Chen', 'mike.chen@genzflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Manager', 1, 2, '2020-03-01'),
('Emma Wilson', 'emma.wilson@genzflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Developer', 1, 3, '2021-01-15'),
('Alex Rivera', 'alex.rivera@genzflow.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Developer', 1, 3, '2021-06-01');

-- Insert sample projects
INSERT INTO projects (name, description, start_date, deadline, status, budget, created_by) VALUES
('Mobile App Development', 'Native mobile application for iOS and Android', '2024-01-01', '2024-06-30', 'Active', 100000.00, 1),
('Backend API', 'RESTful API development and documentation', '2024-01-15', '2024-04-30', 'Active', 50000.00, 1),
('Company Website', 'Corporate website redesign and development', '2024-02-01', '2024-03-31', 'Planning', 25000.00, 1);

-- Insert sample tasks
INSERT INTO tasks (title, description, project_id, assigned_to, assigned_by, status, priority, progress, start_date, deadline) VALUES
('Implement user authentication', 'Create login and registration system with JWT tokens', 1, 4, 3, 'Completed', 'High', 100, '2024-01-10', '2024-01-15'),
('Design mobile UI components', 'Create reusable components for the mobile application', 1, 4, 3, 'In Progress', 'Medium', 65, '2024-01-12', '2024-01-20'),
('Write API documentation', 'Document all REST API endpoints with examples', 2, 4, 2, 'Not Started', 'Low', 0, '2024-01-14', '2024-01-25'),
('Code review for mobile app', 'Review and test the mobile application code', 1, 4, 3, 'Overdue', 'Urgent', 30, '2024-01-08', '2024-01-10'),
('Database optimization', 'Optimize database queries and add indexes', 2, 4, 2, 'In Progress', 'Medium', 45, '2024-01-13', '2024-01-22');
