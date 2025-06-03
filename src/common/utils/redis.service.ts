import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: RedisClientType;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const redisConfig = this.configService.get<RedisConfig>('redis');
    if (!redisConfig) {
      throw new Error('Redis configuration is missing');
    }
    this.client = createClient({
      socket: {
        host: redisConfig.host,
        port: redisConfig.port,
      },
      password: redisConfig.password,
      database: redisConfig.db,
    });
    await this.client.connect();
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  getClient(): RedisClientType {
    if (!this.client) {
      throw new Error('Redis client is not initialized');
    }
    return this.client;
  }
}
