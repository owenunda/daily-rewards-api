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

const getCooldownStatus = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId es requerido");
    }
    
    const redisKey = `daily:cooldown:user:${userId}`;
    const exists = await redisClient.exists(redisKey);
    
    if (!exists) {
      return {
        can_claim: true,
        cooldown_active: false,
        message: "Puedes reclamar tu recompensa diaria"
      };
    }
    
    const ttl = await redisClient.ttl(redisKey);
    const hours = Math.floor(ttl / 3600);
    const minutes = Math.floor((ttl % 3600) / 60);
    const seconds = ttl % 60;
    
    return {
      can_claim: false,
      cooldown_active: true,
      retry_in_seconds: ttl,
      time_remaining: {
        hours,
        minutes,
        seconds
      },
      message: `Debes esperar ${hours}h ${minutes}m ${seconds}s para reclamar tu próxima recompensa`
    };
  } catch (error) {
    throw new Error(`Error al verificar el cooldown: ${error.message}`);
  }
}

export default {
  grantDailyReward,
  getHistoryByUserId,
  getCooldownStatus
}