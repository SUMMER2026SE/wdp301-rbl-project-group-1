import { ICommand } from '@nestjs/cqrs';

export class BanUserCommand implements ICommand {
  constructor(
    public readonly adminId: string,
    public readonly targetUserId: string,
  ) {}
}
