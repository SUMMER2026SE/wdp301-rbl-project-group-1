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
}
