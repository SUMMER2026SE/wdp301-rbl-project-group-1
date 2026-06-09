import { RefreshToken } from '../entities/refresh-token.entity';

export const IAuthRepository = Symbol('IAuthRepository');
export interface IAuthRepository {
  saveRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken>;
  findRefreshTokenByToken(token: string): Promise<RefreshToken | null>;
  /**
   * Atomically revoke a single refresh token by id.
   * Returns true if this call performed the revoke, false if already revoked.
   */
  atomicRevokeRefreshToken(tokenId: string): Promise<boolean>;
  /**
   * Revoke all non-revoked refresh tokens for a user EXCEPT the one just consumed.
   * Used to clean up stale tokens accumulated from a previous always-create bug.
   * This prevents concurrent requests from finding multiple valid tokens simultaneously.
   */
  revokeAllOtherUserTokens(
    userId: string,
    exceptTokenId: string,
  ): Promise<void>;
}
