import pool from "../config/db.js";

const createUser = async (email, passwordHash) => {
  try {
    const res = await pool.query(`
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email
    `, [email, passwordHash]);
    return res.rows[0];
  } catch (error) {
    throw new Error('Error creating user: ' + error.message);
  }
}

const getUserByEmail = async (email) => {
  try {
    const query = 'SELECT id, email, password_hash FROM users WHERE email = $1';
    const values = [email];

    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (error) {
    throw new Error('Error fetching user by email: ' + error.message);
  }
}

export default {
  createUser,
  getUserByEmail
};