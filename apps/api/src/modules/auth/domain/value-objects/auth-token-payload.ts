import { UserRole } from '../../../../shared/domain/enums/enums';

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

export type ResetTokenPayload = {
  sub: string;
  type: string;
};
