const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const { connectDB } = require('../config/database')
const Employee = require('../models/Employee')
const Department = require('../models/Department')
const Project = require('../models/Project')
const Task = require('../models/Task')

async function seedDatabase() {
  try {
    // Connect to database
    await connectDB()
    console.log('Connected to MongoDB')

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Employee.deleteMany({})
    // await Department.deleteMany({})
    // await Project.deleteMany({})
    // await Task.deleteMany({})

    // Create departments
    console.log('Creating departments...')
    const departments = await Department.insertMany([
      {
        name: 'Engineering',
        description: 'Software development and technical operations',
        budget: 500000.00
      },
      {
        name: 'Product',
        description: 'Product management and design',
        budget: 200000.00
      },
      {
        name: 'Human Resources',
        description: 'Employee relations and recruitment',
        budget: 150000.00
      },
      {
        name: 'Finance',
        description: 'Financial management and accounting',
        budget: 100000.00
      }
    ])
    console.log(`✅ Created ${departments.length} departments`)

    // Hash CEO password
    const ceoPasswordHash = await bcrypt.hash('abcd@1234', 12)

    // Create CEO
    console.log('Creating CEO...')
    const ceo = await Employee.create({
      name: 'Sadhu J',
      email: 'sadhuj2005@gmail.com',
      password_hash: ceoPasswordHash,
      role: 'CEO',
      department_id: departments[0]._id,
      join_date: new Date(),
      password_change_required: false,
      is_active: true
    })
    console.log(`✅ Created CEO: ${ceo.email}`)

    // Create sample employees
    console.log('Creating sample employees...')
    const defaultPasswordHash = await bcrypt.hash('GenZFlow@2024', 12)
    
    const employees = await Employee.insertMany([
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@genzflow.com',
        password_hash: defaultPasswordHash,
        role: 'Director',
        department_id: departments[0]._id,
        manager_id: ceo._id,
        join_date: new Date('2020-02-01'),
        password_change_required: true
      },
      {
        name: 'Mike Chen',
        email: 'mike.chen@genzflow.com',
        password_hash: defaultPasswordHash,
        role: 'Manager',
        department_id: departments[0]._id,
        manager_id: null, // Will update after creating Sarah
        join_date: new Date('2020-03-01'),
        password_change_required: true
      },
      {
        name: 'Emma Wilson',
        email: 'emma.wilson@genzflow.com',
        password_hash: defaultPasswordHash,
        role: 'Developer',
        department_id: departments[0]._id,
        manager_id: null, // Will update after creating Mike
        join_date: new Date('2021-01-15'),
        password_change_required: true
      },
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@genzflow.com',
        password_hash: defaultPasswordHash,
        role: 'Developer',
        department_id: departments[0]._id,
        manager_id: null, // Will update after creating Mike
        join_date: new Date('2021-06-01'),
        password_change_required: true
      }
    ])

    // Update manager relationships
    const sarah = employees.find(e => e.email === 'sarah.johnson@genzflow.com')
    const mike = employees.find(e => e.email === 'mike.chen@genzflow.com')
    
    await Employee.updateOne(
      { _id: mike._id },
      { $set: { manager_id: sarah._id } }
    )
    
    await Employee.updateMany(
      { email: { $in: ['emma.wilson@genzflow.com', 'alex.rivera@genzflow.com'] } },
      { $set: { manager_id: mike._id } }
    )

    console.log(`✅ Created ${employees.length} employees`)

    // Create projects
    console.log('Creating projects...')
    const projects = await Project.insertMany([
      {
        name: 'Mobile App Development',
        description: 'Native mobile application for iOS and Android',
        start_date: new Date('2024-01-01'),
        deadline: new Date('2024-06-30'),
        status: 'Active',
        budget: 100000.00,
        created_by: ceo._id
      },
      {
        name: 'Backend API',
        description: 'RESTful API development and documentation',
        start_date: new Date('2024-01-15'),
        deadline: new Date('2024-04-30'),
        status: 'Active',
        budget: 50000.00,
        created_by: ceo._id
      },
      {
        name: 'Company Website',
        description: 'Corporate website redesign and development',
        start_date: new Date('2024-02-01'),
        deadline: new Date('2024-03-31'),
        status: 'Planning',
        budget: 25000.00,
        created_by: ceo._id
      }
    ])
    console.log(`✅ Created ${projects.length} projects`)

    // Create tasks
    console.log('Creating tasks...')
    const tasks = await Task.insertMany([
      {
        title: 'Implement user authentication',
        description: 'Create login and registration system with JWT tokens',
        project_id: projects[0]._id,
        assigned_to: employees[3]._id, // Alex
        assigned_by: mike._id,
        status: 'Completed',
        priority: 'High',
        progress: 100,
        start_date: new Date('2024-01-10'),
        deadline: new Date('2024-01-15')
      },
      {
        title: 'Design mobile UI components',
        description: 'Create reusable components for the mobile application',
        project_id: projects[0]._id,
        assigned_to: employees[3]._id, // Alex
        assigned_by: mike._id,
        status: 'In Progress',
        priority: 'Medium',
        progress: 65,
        start_date: new Date('2024-01-12'),
        deadline: new Date('2024-01-20')
      },
      {
        title: 'Write API documentation',
        description: 'Document all REST API endpoints with examples',
        project_id: projects[1]._id,
        assigned_to: employees[3]._id, // Alex
        assigned_by: sarah._id,
        status: 'Not Started',
        priority: 'Low',
        progress: 0,
        start_date: new Date('2024-01-14'),
        deadline: new Date('2024-01-25')
      },
      {
        title: 'Code review for mobile app',
        description: 'Review and test the mobile application code',
        project_id: projects[0]._id,
        assigned_to: employees[3]._id, // Alex
        assigned_by: mike._id,
        status: 'Overdue',
        priority: 'Urgent',
        progress: 30,
        start_date: new Date('2024-01-08'),
        deadline: new Date('2024-01-10')
      },
      {
        title: 'Database optimization',
        description: 'Optimize database queries and add indexes',
        project_id: projects[1]._id,
        assigned_to: employees[3]._id, // Alex
        assigned_by: sarah._id,
        status: 'In Progress',
        priority: 'Medium',
        progress: 45,
        start_date: new Date('2024-01-13'),
        deadline: new Date('2024-01-22')
      }
    ])
    console.log(`✅ Created ${tasks.length} tasks`)

    console.log('\n🎉 Database seeded successfully!')
    console.log('\nCEO Login Credentials:')
    console.log('Email: sadhuj2005@gmail.com')
    console.log('Password: abcd@1234')
    console.log('\nDefault password for new members: GenZFlow@2024')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run seed
seedDatabase()



