import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtService } from '../../application/services/jwt.service';

@Injectable()
export class JwtServiceImpl implements IJwtService {
  constructor(private jwt: JwtService) {}

  async sign(payload: Record<string, unknown>): Promise<string> {
    return this.jwt.signAsync(payload);
  }

  async verify<T extends object = Record<string, unknown>>(
    token: string,
  ): Promise<T> {
    return this.jwt.verifyAsync<T>(token);
  }
}
