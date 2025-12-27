import pool from '../config/db.js';


const getUserById = async (userId) => {
  try {
    const query = 'SELECT id, email, created_at, reward_points FROM users WHERE id = $1';
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    
  }
}

export default {
  getUserById
}