import { RefreshToken } from '../entities/refresh-token.entity';

export const IAuthRepository = Symbol('IAuthRepository');
export interface IAuthRepository {
  saveRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken>;
  findRefreshTokenByToken(token: string): Promise<RefreshToken | null>;
}
