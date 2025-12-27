import express from 'express'
import envConfig from './src/config/envConfig.js'
import redisClient from './src/redis/redis.client.js'
import routes from './src/routes/routes.js'
const app = express()
const port = 3000

app.use(express.json());

app.get('/hello-world', (req, res) => {
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

app.use('/api/rewards', routes.dailyRoutes);

app.use('/api/auth', routes.authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
