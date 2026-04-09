import { RefreshToken } from '../entities/refresh-token.entity';

export abstract class IAuthRepository {
  abstract saveRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken>;
  abstract findRefreshTokenByToken(token: string): Promise<RefreshToken | null>;
}
