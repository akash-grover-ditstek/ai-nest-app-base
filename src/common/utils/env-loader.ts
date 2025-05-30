import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Returns the appropriate .env file path based on NODE_ENV.
 * - .env.local for NODE_ENV=local
 * - .env.dev for NODE_ENV=dev
 * - .env for production or if no specific file exists
 */
export function getEnvFilePath(): string {
  const nodeEnv = process.env.NODE_ENV || 'production';
  let envFile = '.env';
  if (nodeEnv === 'local') {
    envFile = '.env.local';
  } else if (nodeEnv === 'dev' || nodeEnv === 'development') {
    envFile = '.env.dev';
  }
  const envPath = join(process.cwd(), envFile);
  if (existsSync(envPath)) {
    return envPath;
  }
  return join(process.cwd(), '.env');
}
