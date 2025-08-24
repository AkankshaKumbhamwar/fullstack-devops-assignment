import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

redisClient.on('error', err => console.error('Redis Client Error', err));
redisClient.connect();

class CacheService {
  static async get(key: string): Promise<string | null> {
    return await redisClient.get(key);
  }

  static async set(key: string, value: string, ttl: number): Promise<void> {
    await redisClient.set(key, value, { EX: ttl });
  }
}

export default CacheService;