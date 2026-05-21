import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { CACHE_SERVICE } from 'src/shared/application/constants/cache.constants';
import { ICache } from 'src/shared/application/interfaces/cache.interface';
import { OtpType } from 'src/shared/domain/enums/enums';
import { IHashService } from '../../application/services/hash.service';
import { IOtpService } from '../../application/services/otp.service';
import { Otp } from '../../domain/entities/otp.entity';
import { IOtpRepository } from '../../domain/repositories/otp.repository';

@Injectable()
export class OtpService implements IOtpService {
  constructor(
    @Inject(IOtpRepository) private readonly otpRepository: IOtpRepository,
    @Inject(IHashService) private readonly hashService: IHashService,
    @Inject(CACHE_SERVICE) private readonly cacheService: ICache,
  ) {}

  private generate6DigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generateOtp(
    email: string,
    type: OtpType,
    userId?: string,
    ipAddress?: string,
  ): Promise<{ code: string; expiresAt: Date }> {
    const rateLimitKey = `otp:rate_limit:${email}:${type}`;
    const isRateLimited = await this.cacheService.get<boolean>(rateLimitKey);

    if (isRateLimited) {
      throw new BadRequestException('Please wait before requesting a new OTP.');
    }

    const plainCode = this.generate6DigitCode();
    const codeHash = await this.hashService.hash(plainCode);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const newOtp = Otp.create(createId(), {
      email,
      type,
      userId,
      codeHash,
      expiresAt,
      isUsed: false,
      attempts: 0,
      maxAttempts: 5,
      ipAddress,
      lastSentAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.otpRepository.create(newOtp);
    await this.cacheService.set(rateLimitKey, true, 60);

    return { code: plainCode, expiresAt };
  }

  async verifyOtp(
    email: string,
    type: OtpType,
    code: string,
  ): Promise<boolean> {
    const otp = await this.otpRepository.findByEmailAndType(email, type);

    if (!otp) {
      throw new BadRequestException('OTP not found or already processed.');
    }

    if (otp.isExpired()) {
      throw new BadRequestException('OTP has expired.');
    }

    if (otp.isUsed) {
      throw new BadRequestException('OTP has already been used.');
    }

    if (otp.isMaxAttemptsReached()) {
      throw new BadRequestException('Maximum verification attempts reached.');
    }

    const isValid = await otp.isValid(code, this.hashService);

    if (!isValid) {
      otp.incrementAttempts();
      await this.otpRepository.update(otp);
      throw new BadRequestException('Invalid OTP code.');
    }

    otp.use();
    await this.otpRepository.update(otp);

    return true;
  }

  async resendOtp(
    email: string,
    type: OtpType,
    userId?: string,
    ipAddress?: string,
  ): Promise<{ code: string; expiresAt: Date }> {
    await this.otpRepository.invalidateAllByEmailAndType(email, type);

    return this.generateOtp(email, type, userId, ipAddress);
  }
}
