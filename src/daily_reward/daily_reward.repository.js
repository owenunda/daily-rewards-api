import pool  from '../config/db.js';

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
export default {
  rewardRecord
}