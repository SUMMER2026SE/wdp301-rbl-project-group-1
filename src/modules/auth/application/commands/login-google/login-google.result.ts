import { UserRole } from 'src/shared/domain/enums/enums';

export interface LoginGoogleUserResult {
  id: string;
  email: string;
  role: UserRole;
  nickname: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
}

export interface LoginGoogleResult {
  accessToken: string;
  refreshToken: string;
  user: LoginGoogleUserResult;
}
