import express from 'express'
import envConfig from './src/config/envConfig.js'
import redisClient from './src/redis/redis.client.js'


const app = express()
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/redis-test', async (req, res) => {
  // prueba simple de redis
  await redisClient.set("test:key", "Hola Redis", {
    EX: 60,
  });

  const value = await redisClient.get("test:key");

  res.json({ message: 'hello word', redisValue: value });
})

app.post('/rewards/daily', async (req, res) => {
  const userId = 124; // luego vendrá del JWT
  // clave única por usuario
  const redisKey = `daily:cooldown:user:${userId}`;

  // valida si la clave ya existe
  const alreadyClaimed = await redisClient.exists(redisKey);

  // valida si existe
  if (alreadyClaimed) {
    const ttl = await redisClient.ttl(redisKey);

    return res.status(400).json({
      error: "Ya reclamaste tu recompensa diaria",
      retry_in_seconds: ttl,
    });
  }

  // si no existe, le damos la recompensa y seteamos la clave con expiración de 24 horas
  await redisClient.set(redisKey, Date.now(), {
    EX: 60 * 60 * 24, // 24 horas
  });

  res.json({
    success: true,
    reward: 100,
    message: "Recompensa diaria reclamada 🎉",
  });

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
