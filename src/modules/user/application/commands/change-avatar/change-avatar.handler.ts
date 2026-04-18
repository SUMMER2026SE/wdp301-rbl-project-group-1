import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Readable } from 'node:stream';
import { CloudinaryService } from '../../../../../shared/infrastructure/database/cloudinary/cloudinary.service';
import { IProfileRepository } from '../../../domain/repositories/profile.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { ChangeAvatarCommand } from './change-avatar.command';
import { ChangeAvatarResult } from './change-avatar.result';

@CommandHandler(ChangeAvatarCommand)
export class ChangeAvatarHandler implements ICommandHandler<ChangeAvatarCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly profileRepository: IProfileRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: ChangeAvatarCommand): Promise<ChangeAvatarResult> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = await this.profileRepository.findByUserId(command.userId);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    const stream = Readable.from(command.fileBuffer);

    // Cloudinary expects true for the image parameter when uploading an image
    const secureUrl = await this.cloudinaryService.upload(
      stream,
      `avatars/${command.userId}-${Date.now()}`,
      true,
    );

    profile.update({ avatarUrl: secureUrl });

    await this.profileRepository.save(profile);

    return new ChangeAvatarResult(user.id, secureUrl);
  }
}
