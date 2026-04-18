import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IProfileRepository } from '../../../domain/repositories/profile.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UpdateProfileCommand } from './update-profile.command';
import { UpdateProfileResult } from './update-profile.result';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler implements ICommandHandler<UpdateProfileCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly profileRepository: IProfileRepository,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<UpdateProfileResult> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = await this.profileRepository.findByUserId(command.userId);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    profile.update(command.profileData);

    await this.profileRepository.save(profile);

    return new UpdateProfileResult(user.id, 'Profile updated successfully');
  }
}
