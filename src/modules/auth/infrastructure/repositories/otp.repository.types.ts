import { OtpType } from 'src/shared/domain/enums/enums';

export type PrismaOtpRecord = {
  id: string;
  email: string;
  userId: string | null;
  codeHash: string;
  type: OtpType;
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
  maxAttempts: number;
  lastSentAt: Date | null;
  ipAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OtpWriteData = {
  email: string;
  userId?: string | null;
  codeHash: string;
  type: OtpType;
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
  maxAttempts: number;
  lastSentAt?: Date | null;
  ipAddress?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type OtpDelegate = {
  create(args: { data: OtpWriteData }): Promise<PrismaOtpRecord>;
  findFirst(args: {
    where: {
      email?: string;
      type?: OtpType;
      isUsed?: boolean;
    };
    orderBy?: { createdAt: 'asc' | 'desc' };
  }): Promise<PrismaOtpRecord | null>;
  findUnique(args: {
    where: { id: string };
  }): Promise<PrismaOtpRecord | null>;
  update(args: {
    where: { id: string };
    data: Partial<OtpWriteData>;
  }): Promise<PrismaOtpRecord>;
  updateMany(args: {
    where: { email: string; type: OtpType; isUsed: boolean };
    data: Partial<OtpWriteData>;
  }): Promise<{ count: number }>;
};
