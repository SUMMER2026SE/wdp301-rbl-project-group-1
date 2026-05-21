import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IJwtService } from '../../application/services/jwt.service';

@Injectable()
export class JwtServiceImpl implements IJwtService {
  constructor(
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}

  async sign(payload: Record<string, unknown>): Promise<string> {
    const expiresIn = this.configService.get<string>('auth.accessTokenExpires');
    return this.jwt.signAsync(payload, {
      secret: this.configService.get<string>('auth.secretKey'),
      expiresIn: expiresIn as unknown as undefined,
    });
  }

  async verify<T extends object = Record<string, unknown>>(
    token: string,
  ): Promise<T> {
    return this.jwt.verifyAsync<T>(token, {
      secret: this.configService.get<string>('auth.secretKey'),
    });
  }

  async signRefresh(payload: Record<string, unknown>): Promise<string> {
    const expiresIn = this.configService.get<string>(
      'auth.refreshTokenExpires',
    );
    return this.jwt.signAsync(payload, {
      secret: this.configService.get<string>('auth.refreshSecretKey'),
      expiresIn: expiresIn as unknown as undefined,
    });
  }

  async verifyRefresh<T extends object = Record<string, unknown>>(
    token: string,
  ): Promise<T> {
    return this.jwt.verifyAsync<T>(token, {
      secret: this.configService.get<string>('auth.refreshSecretKey'),
    });
  }

  async signReset(payload: Record<string, unknown>): Promise<string> {
    const expiresIn = this.configService.get<string>(
      'auth.defaultTokenExpires',
    );
    return this.jwt.signAsync(payload, {
      secret: this.configService.get<string>('auth.resetSecretKey'),
      expiresIn: expiresIn as unknown as undefined,
    });
  }

  async verifyReset<T extends object = Record<string, unknown>>(
    token: string,
  ): Promise<T> {
    return this.jwt.verifyAsync<T>(token, {
      secret: this.configService.get<string>('auth.resetSecretKey'),
    });
  }
}
