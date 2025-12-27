import redisClient from "../redis/redis.client.js";
import dailyRewardRepository from "./daily_reward.repository.js";

const grantDailyReward = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId es requerido");
    }
    // clave única por usuario
    const redisKey = `daily:cooldown:user:${userId}`;
    // valida si la clave ya existe
    const alreadyClaimed = await redisClient.exists(redisKey);

    // valida si existe
    if (alreadyClaimed) {
      const ttl = await redisClient.ttl(redisKey);

      return {
        error: "Ya reclamaste tu recompensa diaria",
        retry_in_seconds: ttl,
      };
    }

    // si no existe, le damos la recompensa y seteamos la clave con expiración de 24 horas
    await redisClient.set(redisKey, Date.now(), {
      EX: 60 * 60 * 24, // 24 horas
    });

    // guardamos el registro en la base de datos
    const rewardRecord = {
      user_id: userId,
      reward_amount: 100,
      claimed_at: new Date(),
    }
    await dailyRewardRepository.rewardRecord(rewardRecord.user_id, rewardRecord.reward_amount, rewardRecord.claimed_at);
    
    // agregamos los puntos al usuario
    await dailyRewardRepository.addPointsToUser(userId, 100);
    
    return {
      success: true,
      reward: 100,
      message: "Recompensa diaria reclamada 🎉",
    };
  } catch (error) {
    throw new Error(`Error al otorgar la recompensa diaria: ${error.message}`);
  }
}

const getHistoryByUserId = async (userId) => {
  try {
    return await dailyRewardRepository.getHistoryByUserId(userId);
  } catch (error) {
    throw error;
  }
}
export default {
  grantDailyReward,
  getHistoryByUserId
}