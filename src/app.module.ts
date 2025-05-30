import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ErrorLoggingInterceptor } from './common/interceptors/error-logging.interceptor';
import { getEnvFilePath } from './common/utils/env-loader';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';

const envFilePath: string = getEnvFilePath();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorLoggingInterceptor,
    },
  ],
})
export class AppModule {}
