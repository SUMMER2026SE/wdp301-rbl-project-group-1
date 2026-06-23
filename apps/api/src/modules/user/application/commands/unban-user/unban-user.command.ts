import { ICommand } from '@nestjs/cqrs';

export class UnbanUserCommand implements ICommand {
  constructor(
    public readonly adminId: string,
    public readonly targetUserId: string,
  ) {}
}
