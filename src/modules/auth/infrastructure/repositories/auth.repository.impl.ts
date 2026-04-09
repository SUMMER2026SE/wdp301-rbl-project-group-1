import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import {
  PrismaRefreshTokenRecord,
  RefreshTokenDelegate,
  RefreshTokenWriteData,
} from './auth.repository.types';

@Injectable()
export class PrismaAuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get refreshTokenDelegate(): RefreshTokenDelegate {
    return this.prisma.refreshToken as unknown as RefreshTokenDelegate;
  }

  private mapToDomain(
    refreshTokenPrisma: PrismaRefreshTokenRecord,
  ): RefreshToken {
    return RefreshToken.create(refreshTokenPrisma.id, {
      userId: refreshTokenPrisma.userId,
      token: refreshTokenPrisma.token,
      expiresAt: refreshTokenPrisma.expiresAt,
      createdAt: refreshTokenPrisma.createdAt,
      revoked: refreshTokenPrisma.revoked,
    });
  }

  async saveRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken> {
    const data: RefreshTokenWriteData = {
      userId: refreshToken.userId,
      token: refreshToken.token,
      expiresAt: refreshToken.expiresAt,
      createdAt: refreshToken.createdAt,
      revoked: refreshToken.revoked,
    };

    const savedRefreshToken = refreshToken.id
      ? await this.refreshTokenDelegate.update({
          where: { id: refreshToken.id },
          data,
        })
      : await this.refreshTokenDelegate.create({ data });

    return this.mapToDomain(savedRefreshToken);
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

    return this.mapToDomain(refreshTokenPrisma);
  }
}
