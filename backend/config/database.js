const mongoose = require('mongoose')
require('dotenv').config()

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 
  `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || 'genzflow_db'}`

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, options)
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    process.exit(1)
  }
}

// Test connection
const testConnection = async () => {
  try {
    await mongoose.connection.db.admin().ping()
    return true
  } catch (error) {
    return false
  }
}

// Get database instance
const getDB = () => {
  return mongoose.connection.db
}

// Close connection
const closeConnection = async () => {
  try {
    await mongoose.connection.close()
    console.log('MongoDB connection closed')
  } catch (error) {
    console.error('Error closing MongoDB connection:', error)
  }
}

module.exports = {
  connectDB,
  testConnection,
  getDB,
  closeConnection,
  mongoose
}
