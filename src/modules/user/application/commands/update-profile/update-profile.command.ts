import { ICommand } from '@nestjs/cqrs';
import { Gender } from 'src/shared/domain/enums/enums';

export class UpdateProfileCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly profileData: {
      email?: string;
      nickname?: string;
      avatarUrl?: string;
      phone?: string;
      dateOfBirth?: Date;
      gender?: Gender;
      address?: string;
    },
  ) {}
}
