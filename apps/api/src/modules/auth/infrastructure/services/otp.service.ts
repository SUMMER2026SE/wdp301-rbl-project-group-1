import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CACHE_SERVICE } from 'src/shared/application/constants/cache.constants';
import { ICache } from 'src/shared/application/interfaces/cache.interface';
import { OtpType } from 'src/shared/domain/enums/enums';
import { IHashService } from '../../application/services/hash.service';
import { IOtpService } from '../../application/services/otp.service';

interface RedisOtpPayload {
  codeHash: string;
  attempts: number;
  maxAttempts: number;
}

@Injectable()
export class OtpService implements IOtpService {
  constructor(
    @Inject(IHashService) private readonly hashService: IHashService,
    @Inject(CACHE_SERVICE) private readonly cacheService: ICache,
  ) {}

  private generate6DigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generateOtp(
    email: string,
    type: OtpType,
  ): Promise<{ code: string; expiresAt: Date }> {
    const rateLimitKey = `otp:rate_limit:${email}:${type}`;
    const isRateLimited = await this.cacheService.get<boolean>(rateLimitKey);

    if (isRateLimited) {
      throw new BadRequestException('Please wait before requesting a new OTP.');
    }

    const plainCode = this.generate6DigitCode();
    const codeHash = await this.hashService.hash(plainCode);

    // OTP expires in 5 minutes
    const ttlSeconds = 5 * 60;
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    const otpKey = `otp:verify:${type}:${email}`;
    const payload: RedisOtpPayload = {
      codeHash,
      attempts: 0,
      maxAttempts: 5,
    };

    await this.cacheService.set(otpKey, payload, ttlSeconds);
    // Rate limit for next request: 60 seconds
    await this.cacheService.set(rateLimitKey, true, 60);

    return { code: plainCode, expiresAt };
  }

  async verifyOtp(
    email: string,
    type: OtpType,
    code: string,
  ): Promise<boolean> {
    const otpKey = `otp:verify:${type}:${email}`;
    const otpPayload = await this.cacheService.get<RedisOtpPayload>(otpKey);

    if (!otpPayload) {
      throw new BadRequestException('OTP not found or has expired.');
    }

    if (otpPayload.attempts >= otpPayload.maxAttempts) {
      // Clean up to prevent further attempts on this code
      await this.cacheService.del(otpKey);
      throw new BadRequestException(
        'Maximum verification attempts reached. Please request a new OTP.',
      );
    }

    const isValid = await this.hashService.compare(code, otpPayload.codeHash);

    if (!isValid) {
      otpPayload.attempts += 1;
      // We don't want to reset the TTL, ideally we'd use 'KEEPTTL' or just accept slight TTL reset.
      // Since ICache interface might not support KEEPTTL, we just set it again. The exact TTL is not super strict.
      // Alternatively, we could just let the original expire on its own if ICache supports it,
      // but standard set might overwrite TTL. We'll pass a default 5m TTL here just to be safe.
      await this.cacheService.set(otpKey, otpPayload, 5 * 60);
      throw new BadRequestException('Invalid OTP code.');
    }

    // OTP is valid, clean up
    await this.cacheService.del(otpKey);
    return true;
  }

  async resendOtp(
    email: string,
    type: OtpType,
  ): Promise<{ code: string; expiresAt: Date }> {
    const otpKey = `otp:verify:${type}:${email}`;
    await this.cacheService.del(otpKey);

    return this.generateOtp(email, type);
  }
}
