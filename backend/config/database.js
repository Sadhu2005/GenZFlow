const mysql = require('mysql2')
require('dotenv').config()

// Create connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sadhu_company_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
})

// Get connection from pool
const getConnection = (callback) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err)
      return callback(err, null)
    }
    callback(null, connection)
  })
}

// Execute query with promise support
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.execute(sql, params, (err, results, fields) => {
      if (err) {
        console.error('Query error:', err)
        return reject(err)
      }
      resolve(results)
    })
  })
}

// Execute transaction
const transaction = (queries) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err)
      }
      
      connection.beginTransaction((err) => {
        if (err) {
          connection.release()
          return reject(err)
        }
        
        const results = []
        let completed = 0
        
        queries.forEach(({ sql, params }, index) => {
          connection.execute(sql, params, (err, result) => {
            if (err) {
              connection.rollback(() => {
                connection.release()
                reject(err)
              })
              return
            }
            
            results[index] = result
            completed++
            
            if (completed === queries.length) {
              connection.commit((err) => {
                if (err) {
                  connection.rollback(() => {
                    connection.release()
                    reject(err)
                  })
                  return
                }
                
                connection.release()
                resolve(results)
              })
            }
          })
        })
      })
    })
  })
}

// Test database connection
const testConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
        return
      }
      
      connection.ping((err) => {
        connection.release()
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  })
}

module.exports = {
  pool,
  getConnection,
  query,
  transaction,
  testConnection
}
