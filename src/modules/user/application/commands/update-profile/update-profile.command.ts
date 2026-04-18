import { ICommand } from '@nestjs/cqrs';
import { Gender } from 'src/shared/domain/enums/enums';

export class UpdateProfileCommand implements ICommand {
  constructor(
    public readonly userId: number,
    public readonly profileData: {
      nickname?: string;
      avatarUrl?: string;
      phone?: string;
      dateOfBirth?: Date;
      gender?: Gender;
      address?: string;
    },
  ) {}
}
