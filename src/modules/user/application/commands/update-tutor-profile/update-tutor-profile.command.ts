import { ICommand } from '@nestjs/cqrs';

export class UpdateTutorProfileCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly data: {
      bio?: string | null;
      specialization?: string | null;
      experience?: number | null;
      education?: string | null;
      pricePerHour?: number | null;
    },
  ) {}
}
