import { RedisClientType } from 'redis';

export interface RedisServiceInterface {
  getClient(): RedisClientType;
}
