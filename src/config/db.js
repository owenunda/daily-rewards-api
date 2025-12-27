import { Pool } from 'pg'
import envConfig from './envConfig.js'

const database_url = envConfig.DATABASE_URL

const pool = new Pool({
  connectionString: database_url,
})

// Test the database connection

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err)
  } else {
    console.log('Database connected successfully at:', res.rows[0].now)
  }
})

export default pool