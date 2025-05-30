import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseConnectionService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseConnectionService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    this.connection.on('error', (err: unknown) => {
      this.logger.error('MongoDB connection error:', err);
    });
    this.connection.on('disconnected', () => {
      this.logger.error('MongoDB disconnected.');
    });
    this.connection.on('connected', () => {
      this.logger.log('MongoDB connected successfully.');
    });
  }
}
