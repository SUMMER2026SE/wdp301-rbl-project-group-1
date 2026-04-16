import { UserRole } from '../../../../../shared/domain/enums/enums';

export class RegisterCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly nickname: string,
  ) {}
}
