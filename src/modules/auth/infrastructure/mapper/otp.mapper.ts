import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { Otp } from '../../domain/entities/otp.entity';
import { OtpWriteData, PrismaOtpRecord } from '../repositories/otp.repository.types';

export class OtpMapper
  implements IMapper<Otp, PrismaOtpRecord | OtpWriteData>
{
  toDomain(raw: PrismaOtpRecord): Otp {
    return Otp.create(raw.id, {
      email: raw.email,
      userId: raw.userId ?? undefined,
      codeHash: raw.codeHash,
      type: raw.type,
      expiresAt: raw.expiresAt,
      isUsed: raw.isUsed,
      attempts: raw.attempts,
      maxAttempts: raw.maxAttempts,
      lastSentAt: raw.lastSentAt ?? undefined,
      ipAddress: raw.ipAddress ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(domain: Otp): OtpWriteData {
    return {
      email: domain.email,
      userId: domain.userId ?? null,
      codeHash: domain.codeHash,
      type: domain.type,
      expiresAt: domain.expiresAt,
      isUsed: domain.isUsed,
      attempts: domain.attempts,
      maxAttempts: domain.maxAttempts,
      lastSentAt: domain.lastSentAt ?? null,
      ipAddress: domain.ipAddress ?? null,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
