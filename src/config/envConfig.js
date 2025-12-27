import dotenv from 'dotenv';

dotenv.config();
const env = process.env;


const envConfig = {
  REDIS_CLIENT_URL: env.REDIS_CLIENT_URL || 'redis://localhost:6379',
  DATABASE_URL: env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/daily_rewards_db',
  JWT_SECRET: env.JWT_SECRET || 'your_jwt_secret_key',
}

export default envConfig;