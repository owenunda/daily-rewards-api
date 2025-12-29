import express from 'express'
import envConfig from './src/config/envConfig.js'
import redisClient from './src/redis/redis.client.js'
import routes from './src/routes/routes.js'
import cors from 'cors'
import { swaggerUi, swaggerSpec } from './src/config/swagger.js'

const app = express()
const port = 3000

const allowedOrigins = '*'; // Puedes ajustar esto a tus necesidades

const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Daily Rewards API Documentation',
}));

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
app.use('/api/user', routes.userRoutes);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
