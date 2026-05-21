import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ResetTokenPayload } from '../../domain/value-objects/auth-token-payload';

@Injectable()
export class ResetTokenStrategy extends PassportStrategy(
  Strategy,
  'reset-token',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('auth.resetSecretKey') ?? '',
    });
  }

  validate(payload: ResetTokenPayload) {
    if (payload.type !== 'reset_token') {
      throw new UnauthorizedException('Invalid token type');
    }

    return {
      email: payload.sub,
    };
  }
}
