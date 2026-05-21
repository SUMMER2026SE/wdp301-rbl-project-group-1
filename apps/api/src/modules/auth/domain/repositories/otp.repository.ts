import { OtpType } from 'src/shared/domain/enums/enums';
import { Otp } from '../entities/otp.entity';

export const IOtpRepository = Symbol('IOtpRepository');
export interface IOtpRepository {
  create(otp: Otp): Promise<void>;
  findByEmailAndType(email: string, type: OtpType): Promise<Otp | null>;
  findById(id: string): Promise<Otp | null>;
  update(otp: Otp): Promise<void>;
  invalidateAllByEmailAndType(email: string, type: OtpType): Promise<void>;
}
