import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { AuthTokenPayload } from '../../domain/value-objects/auth-token-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('SECRET_KEY') ?? '',
    });
  }

  validate(payload: AuthTokenPayload): { userId: string; role: UserRole } {
    return {
      userId: payload.sub,
      role: payload.role,
    };
  }
}
