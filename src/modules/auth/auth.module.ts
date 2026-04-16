import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { StringValue } from 'ms';

import { LoginCommandHandler } from './application/commands/login/login.handler';
import { LogoutCommandHandler } from './application/commands/logout/logout.handler';
import { RefreshTokenCommandHandler } from './application/commands/refresh-token/refresh-token.handler';
import { RegisterCommandHandler } from './application/commands/register/register.handler';
import { GetMeQueryHandler } from './application/queries/get-me/get-me.handler';
import { IAuthRepository } from './domain/repositories/auth.repository.interface';
import { PrismaAuthRepository } from './infrastructure/repositories/auth.repository.impl';
import { AuthController } from './presentation/controllers/auth.controller';

import { IHashService } from './application/services/hash.service';
import { IJwtService } from './application/services/jwt.service';
import { BcryptService } from './infrastructure/services/hash.service';
import { JwtServiceImpl } from './infrastructure/services/jwt.service';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';

import { UserModule } from '../user/user.module';

const CommandHandlers = [
  RegisterCommandHandler,
  LoginCommandHandler,
  RefreshTokenCommandHandler,
  LogoutCommandHandler,
];

const QueryHandlers = [GetMeQueryHandler];

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
    JwtStrategy,
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
  ],
})
export class AuthModule {}
