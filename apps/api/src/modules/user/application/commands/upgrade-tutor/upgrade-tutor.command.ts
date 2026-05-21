import { ICommand } from '@nestjs/cqrs';

export class UpgradeTutorCommand implements ICommand {
  constructor(public readonly userId: string) {}
}
