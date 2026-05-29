import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UpdateProfileCommand } from './update-profile.command';
import { UpdateProfileResult } from './update-profile.result';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
  implements
    ICommandHandler<UpdateProfileCommand>,
    ICommand<UpdateProfileCommand, UpdateProfileResult>
{
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdateProfileCommand): Promise<UpdateProfileResult> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (command.profileData.email && command.profileData.email !== user.email) {
      const existing = await this.userRepository.findByEmail(
        command.profileData.email,
      );
      if (existing) {
        throw new ConflictException('Email already in use');
      }
      user.updateEmail(command.profileData.email);
    }

    user.updateProfile({
      nickname: command.profileData.nickname,
      avatarUrl: command.profileData.avatarUrl,
      phone: command.profileData.phone,
      dateOfBirth: command.profileData.dateOfBirth,
      gender: command.profileData.gender,
      address: command.profileData.address,
    });

    await this.userRepository.save(user);

    return new UpdateProfileResult(user.id, 'Profile updated successfully');
  }
}
