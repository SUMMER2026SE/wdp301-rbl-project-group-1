import { Module } from '@nestjs/common';
import { AppConfigModule } from './shared/infrastructure/config/config.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { HealthModule } from 'src/modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, HealthModule, AuthModule],
})
export class AppModule {}
