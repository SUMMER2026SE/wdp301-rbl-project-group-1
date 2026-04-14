import { UserRole } from 'src/shared/domain/enums/enums';

export interface LoginUserResult {
  id: number;
  email: string;
  role: UserRole;
  nickname: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: LoginUserResult;
}
