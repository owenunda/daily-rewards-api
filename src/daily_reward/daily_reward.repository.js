import pool from '../config/db.js';

const rewardRecord = async (userId, rewardAmount, claimed_at) => {
  try {
    const { rows } = await pool.query(
      'INSERT INTO daily_rewards (user_id, reward_amount, claimed_at) VALUES ($1, $2, $3) RETURNING *',
      [userId, rewardAmount, claimed_at]
    );
    return rows[0];
  } catch (error) {
    throw new Error(`Error al guardar el registro de recompensa diaria: ${error.message}`);
  }
}

const addPointsToUser = async (userId, points) => {
  try {
    const { rows } = await pool.query(
      'UPDATE users SET reward_points = reward_points + $1 WHERE id = $2 RETURNING *',
      [points, userId]
    );
    return rows[0];
  } catch (error) {
    throw new Error(`Error al agregar puntos al usuario: ${error.message}`);
  }
}

const getHistoryByUserId = async (userId) => {
  try {
    const query = 'SELECT * FROM daily_rewards WHERE user_id = $1 ORDER BY claimed_at DESC';
    const values = [userId];
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw new Error(`Error retrieving reward history: ${error.message}`);
  }
}
export default {
  rewardRecord,
  addPointsToUser,
  getHistoryByUserId
}