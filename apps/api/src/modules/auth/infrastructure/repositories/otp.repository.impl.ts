import { Injectable } from '@nestjs/common';
import { OtpType } from 'src/shared/domain/enums/enums';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Otp } from '../../domain/entities/otp.entity';
import { IOtpRepository } from '../../domain/repositories/otp.repository';
import { OtpMapper } from '../mapper/otp.mapper';
import { OtpDelegate, PrismaOtpRecord } from './otp.repository.types';

@Injectable()
export class PrismaOtpRepository implements IOtpRepository {
  private readonly mapper = new OtpMapper();

  constructor(private readonly prisma: PrismaService) {}

  private get otpDelegate(): OtpDelegate {
    return this.prisma.otp as unknown as OtpDelegate;
  }

  async create(otp: Otp): Promise<void> {
    await this.otpDelegate.create({
      data: this.mapper.toPersistence(otp),
    });
  }

  /**
   * Luôn lấy OTP mới nhất chưa bị dùng theo email + type.
   * Dùng raw query để đảm bảo ORDER BY createdAt DESC LIMIT 1.
   */
  async findByEmailAndType(email: string, type: OtpType): Promise<Otp | null> {
    const rows = await this.prisma.$queryRaw<PrismaOtpRecord[]>`
      SELECT
        id,
        email,
        user_id        AS "userId",
        code_hash      AS "codeHash",
        type,
        expires_at     AS "expiresAt",
        is_used        AS "isUsed",
        attempts,
        max_attempts   AS "maxAttempts",
        last_sent_at   AS "lastSentAt",
        ip_address     AS "ipAddress",
        created_at     AS "createdAt",
        updated_at     AS "updatedAt"
      FROM otp
      WHERE email = ${email}
        AND type  = ${type}::"OtpType"
        AND is_used = false
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const record = rows[0];
    if (!record) return null;

    return this.mapper.toDomain(record);
  }

  async findById(id: string): Promise<Otp | null> {
    const record = await this.otpDelegate.findUnique({ where: { id } });
    if (!record) return null;
    return this.mapper.toDomain(record);
  }

  async update(otp: Otp): Promise<void> {
    await this.otpDelegate.update({
      where: { id: otp.id },
      data: this.mapper.toPersistence(otp),
    });
  }

  /**
   * Vô hiệu hóa tất cả OTP chưa dùng của email + type.
   * Dùng trước khi tạo OTP mới trong resendOtp.
   */
  async invalidateAllByEmailAndType(
    email: string,
    type: OtpType,
  ): Promise<void> {
    await this.otpDelegate.updateMany({
      where: { email, type, isUsed: false },
      data: { isUsed: true, updatedAt: new Date() },
    });
  }
}
