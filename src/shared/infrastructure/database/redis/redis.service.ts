import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ICache } from 'src/shared/application/interfaces/cache.interface';

@Injectable()
export class RedisService implements OnModuleDestroy, ICache {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    this.client = new Redis(redisUrl || 'redis://localhost:6379', {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 5000,
      commandTimeout: 3000,
    });

    // Handle connection errors gracefully to prevent application crash
    this.client.on('error', (error) => {
      console.warn(`[RedisService] Connection error: ${error.message}`);
    });
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const data = JSON.stringify(value);

    if (ttl) {
      await this.client.set(key, data, 'EX', ttl);
    } else {
      await this.client.set(key, data);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.client.expire(key, ttl);
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }
}
