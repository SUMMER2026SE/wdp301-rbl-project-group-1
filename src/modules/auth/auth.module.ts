import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StringValue } from 'ms';

import { ForgotPasswordCommandHandler } from './application/commands/forgot-password/forgot-password.handler';
import { LoginGoogleCommandHandler } from './application/commands/login-google/login-google.handler';
import { LoginCommandHandler } from './application/commands/login/login.handler';
import { LogoutCommandHandler } from './application/commands/logout/logout.handler';
import { RefreshTokenCommandHandler } from './application/commands/refresh-token/refresh-token.handler';
import { RegisterCommandHandler } from './application/commands/register/register.handler';
import { ResetPasswordCommandHandler } from './application/commands/reset-password/reset-password.handler';
import { VerifyOtpCommandHandler } from './application/commands/verify-otp/verify-otp.handler';
import { GetMeQueryHandler } from './application/queries/get-me/get-me.handler';
import { IAuthRepository } from './domain/repositories/auth.repository.interface';
import { PrismaAuthRepository } from './infrastructure/repositories/auth.repository.impl';
import { AuthController } from './presentation/controllers/auth.controller';

import { IHashService } from './application/services/hash.service';
import { IJwtService } from './application/services/jwt.service';
import { IOtpService } from './application/services/otp.service';
import { IOtpRepository } from './domain/repositories/otp.repository';
import { PrismaOtpRepository } from './infrastructure/repositories/otp.repository.impl';
import { GoogleOAuthService } from './infrastructure/services/google-auth.service';
import { BcryptService } from './infrastructure/services/hash.service';
import { JwtServiceImpl } from './infrastructure/services/jwt.service';
import { OtpService } from './infrastructure/services/otp.service';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';
import { ResetTokenStrategy } from './presentation/strategies/reset-token.strategy';

import { UserModule } from '../user/user.module';

import { SyncUserToRabbitMqHandler } from './application/events/sync-user-to-rabbitmq.handler';

const CommandHandlers = [
  RegisterCommandHandler,
  LoginCommandHandler,
  LoginGoogleCommandHandler,
  RefreshTokenCommandHandler,
  LogoutCommandHandler,
  ForgotPasswordCommandHandler,
  VerifyOtpCommandHandler,
  ResetPasswordCommandHandler,
];

const QueryHandlers = [GetMeQueryHandler];

const EventHandlers = [SyncUserToRabbitMqHandler];

@Module({
  imports: [
    CqrsModule,
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const accessTokenExpires =
          configService.get<string>('auth.accessTokenExpires') ?? '2m';

        return {
          secret: configService.get<string>('auth.secretKey'),
          signOptions: {
            expiresIn: accessTokenExpires as StringValue,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    JwtStrategy,
    ResetTokenStrategy,
    {
      provide: IHashService,
      useClass: BcryptService,
    },
    {
      provide: IJwtService,
      useClass: JwtServiceImpl,
    },
    {
      provide: IAuthRepository,
      useClass: PrismaAuthRepository,
    },
    {
      provide: IOtpRepository,
      useClass: PrismaOtpRepository,
    },
    {
      provide: IOtpService,
      useClass: OtpService,
    },
    GoogleOAuthService,
  ],
  exports: [IHashService],
})
export class AuthModule {}
