import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';

import { LoginCommandHandler } from './application/commands/login/login.handler';
import { RegisterCommandHandler } from './application/commands/register/register.handler';
import { AuthController } from './presentation/controllers/auth.controller';

import { IHashService } from './application/services/hash.service';
import { IJwtService } from './application/services/jwt.service';
import { BcryptService } from './infrastructure/services/hash.service';
import { JwtServiceImpl } from './infrastructure/services/jwt.service';

import { UserModule } from '../user/user.module';

const CommandHandlers = [RegisterCommandHandler, LoginCommandHandler];

@Module({
  imports: [
    CqrsModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'test-secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...CommandHandlers,
    {
      provide: IHashService,
      useClass: BcryptService,
    },
    {
      provide: IJwtService,
      useClass: JwtServiceImpl,
    },
  ],
})
export class AuthModule {}
