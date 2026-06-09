import { UserRole } from '../../../../shared/domain/enums/enums';

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
  jti?: string;
};

export type ResetTokenPayload = {
  sub: string;
  type: string;
};
