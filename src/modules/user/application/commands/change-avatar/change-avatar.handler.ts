import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Readable } from 'node:stream';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { IImageStorage } from '../../../../storage/domain/interfaces/image-storage.service.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { ChangeAvatarCommand } from './change-avatar.command';
import { ChangeAvatarResult } from './change-avatar.result';

@CommandHandler(ChangeAvatarCommand)
export class ChangeAvatarHandler
  implements
    ICommandHandler<ChangeAvatarCommand>,
    ICommand<ChangeAvatarCommand, ChangeAvatarResult>
{
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IImageStorage)
    private readonly imageStorage: IImageStorage,
  ) {}

  async execute(command: ChangeAvatarCommand): Promise<ChangeAvatarResult> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const stream = Readable.from(command.fileBuffer);

    // Cloudinary expects true for the image parameter when uploading an image
    const secureUrl = await this.imageStorage.upload(
      stream,
      `avatars/${command.userId}-${Date.now()}`,
      true,
    );

    user.updateProfile({ avatarUrl: secureUrl });

    await this.userRepository.save(user);

    return new ChangeAvatarResult(user.id, secureUrl);
  }
}
