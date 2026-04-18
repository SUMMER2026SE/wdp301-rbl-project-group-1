import { UserRole } from 'src/shared/domain/enums/enums';

export interface LoginUserResult {
  id: string;
  email: string;
  role: UserRole;
  nickname: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: LoginUserResult;
}
