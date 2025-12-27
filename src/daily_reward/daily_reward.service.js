import redisClient from "../redis/redis.client.js";


const grantDailyReward = async (userId) => {
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

  return {
    success: true,
    reward: 100,
    message: "Recompensa diaria reclamada 🎉",
  };
}

export default {
  grantDailyReward
}