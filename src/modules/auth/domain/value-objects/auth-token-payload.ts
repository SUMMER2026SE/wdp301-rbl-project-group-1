import { UserRole } from '../../../../shared/domain/enums/enums';

export type AuthTokenPayload = {
  sub: string;
  role: UserRole;
};
