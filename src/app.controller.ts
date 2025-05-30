import { Controller, Get } from '@nestjs/common';
import { AppHealth } from './app-health.interface';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  health(): AppHealth {
    return this.appService.getHealth();
  }
}
