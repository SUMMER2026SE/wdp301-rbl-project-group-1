import { AggregateRoot } from 'src/shared/domain/entities/aggregate-root';
import { OtpType } from 'src/shared/domain/enums/enums';
import { IHashService } from '../../application/services/hash.service';

export interface OtpProps {
  email: string;
  userId?: string;
  codeHash: string;
  type: OtpType;
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
  maxAttempts: number;
  lastSentAt?: Date;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Otp extends AggregateRoot<string> {
  private props: OtpProps;

  private constructor(id: string, props: OtpProps) {
    super(id);
    this.props = props;
  }

  static create(id: string, props: OtpProps): Otp {
    return new Otp(id, props);
  }

  get email(): string {
    return this.props.email;
  }

  get userId(): string | undefined {
    return this.props.userId;
  }

  get codeHash(): string {
    return this.props.codeHash;
  }

  get type(): OtpType {
    return this.props.type;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get isUsed(): boolean {
    return this.props.isUsed;
  }

  get attempts(): number {
    return this.props.attempts;
  }

  get maxAttempts(): number {
    return this.props.maxAttempts;
  }

  get lastSentAt(): Date | undefined {
    return this.props.lastSentAt;
  }

  get ipAddress(): string | undefined {
    return this.props.ipAddress;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isExpired(now: Date = new Date()): boolean {
    return this.props.expiresAt < now;
  }

  isMaxAttemptsReached(): boolean {
    return this.props.attempts >= this.props.maxAttempts;
  }

  async isValid(
    plainCode: string,
    hashService: IHashService,
  ): Promise<boolean> {
    return await hashService.compare(plainCode, this.props.codeHash);
  }

  use(): void {
    if (this.isExpired()) {
      throw new Error('OTP has expired.');
    }
    if (this.props.isUsed) {
      throw new Error('OTP has already been used.');
    }
    this.props.isUsed = true;
  }

  incrementAttempts(): void {
    this.props.attempts++;
  }
}
