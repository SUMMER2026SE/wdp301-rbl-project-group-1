import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { RefreshTokenMapper } from '../mapper/refresh-token.mapper';
import {
  PrismaRefreshTokenRecord,
  RefreshTokenDelegate,
} from './auth.repository.types';

@Injectable()
export class PrismaAuthRepository implements IAuthRepository {
  private readonly mapper = new RefreshTokenMapper();

  constructor(private readonly prisma: PrismaService) {}

  private get refreshTokenDelegate(): RefreshTokenDelegate {
    return this.prisma.refreshToken as unknown as RefreshTokenDelegate;
  }

  async saveRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken> {
    const data = this.mapper.toPersistence(refreshToken);

    // If the entity has a real id, update; otherwise always create (new tokens have no id)
    const savedRefreshToken = refreshToken.id
      ? await this.refreshTokenDelegate.update({
          where: { id: refreshToken.id },
          data,
        })
      : await this.refreshTokenDelegate.create({ data });

    return this.mapper.toDomain(savedRefreshToken);
  }

  async findRefreshTokenByToken(token: string): Promise<RefreshToken | null> {
    const rows = await this.prisma.$queryRaw<PrismaRefreshTokenRecord[]>`
      SELECT
        id,
        user_id AS "userId",
        token,
        expires_at AS "expiresAt",
        created_at AS "createdAt",
        revoked
      FROM refresh_token
      WHERE token = ${token}
      LIMIT 1
    `;

    const refreshTokenPrisma = rows[0];

    if (!refreshTokenPrisma) {
      return null;
    }

    return this.mapper.toDomain(refreshTokenPrisma);
  }

  /**
   * Atomically marks a single refresh token as revoked using a conditional UPDATE.
   * Only updates if the token is currently NOT revoked — safe for concurrent requests.
   *
   * @returns true if the token was revoked by this call (this request wins),
   *          false if it was already revoked (another request won the race).
   */
  async atomicRevokeRefreshToken(tokenId: string): Promise<boolean> {
    const result = await this.prisma.$executeRaw`
      UPDATE refresh_token
      SET revoked = true
      WHERE id = ${tokenId}
        AND revoked = false
    `;

    // $executeRaw returns the number of affected rows
    return result > 0;
  }

  /**
   * Revoke all active (non-revoked) refresh tokens for a user except the one
   * just consumed. Cleans up stale tokens to prevent concurrent requests from
   * finding multiple valid tokens simultaneously.
   */
  async revokeAllOtherUserTokens(
    userId: string,
    exceptTokenId: string,
  ): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revoked: false,
        id: { not: exceptTokenId },
      },
      data: { revoked: true },
    });
  }
}
