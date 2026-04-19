import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import {
  PrismaRefreshTokenRecord,
  RefreshTokenWriteData,
} from '../repositories/auth.repository.types';

export class RefreshTokenMapper implements IMapper<
  RefreshToken,
  PrismaRefreshTokenRecord | RefreshTokenWriteData
> {
  toDomain(raw: PrismaRefreshTokenRecord): RefreshToken {
    return RefreshToken.create(raw.id, {
      userId: raw.userId,
      token: raw.token,
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt,
      revoked: raw.revoked,
    });
  }

  toPersistence(domain: RefreshToken): RefreshTokenWriteData {
    return {
      userId: domain.userId,
      token: domain.token,
      expiresAt: domain.expiresAt,
      createdAt: domain.createdAt,
      revoked: domain.revoked,
    };
  }
}
