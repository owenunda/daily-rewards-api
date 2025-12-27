import dotenv from 'dotenv';

dotenv.config();
const env = process.env;


const envConfig = {
  REDIS_CLIENT_URL: env.REDIS_CLIENT_URL || 'redis://localhost:6379',
}

export default envConfig;