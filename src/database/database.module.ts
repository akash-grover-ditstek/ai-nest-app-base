import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnectionService } from './database-connection.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_CONNECTION'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseConnectionService],
})
export class DatabaseModule {}
