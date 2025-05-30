import { Injectable } from '@nestjs/common';
import { AppHealth } from './app-health.interface';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Returns health status and timestamp for health check endpoint.
   */
  getHealth(): AppHealth {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
