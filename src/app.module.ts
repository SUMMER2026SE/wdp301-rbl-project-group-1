import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { HealthModule } from 'src/modules/health/health.module';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/presentation/guards/roles.guard';
import { AppConfigModule } from './shared/infrastructure/config/config.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { LoggerModule } from './shared/infrastructure/logger/logger.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    LoggerModule,
    HealthModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
