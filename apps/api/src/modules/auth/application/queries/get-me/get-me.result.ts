import { UserRole } from '../../../../../shared/domain/enums/enums';

export interface GetMeResult {
  id: string;
  email: string;
  role: UserRole;
  nickname: string;
  isActive: boolean;
  isVerified: boolean;
  isFlag: boolean;
  reportCount: number;
  createdAt: Date;
}
