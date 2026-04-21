import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { ConflictException } from '../../../../../shared/domain/exceptions/domain-exception';
import { Profile } from '../../../../user/domain/entities/profile.entity';
import { User } from '../../../../user/domain/entities/user.entity';
import { IProfileRepository } from '../../../../user/domain/repositories/profile.repository.interface';
import { IUserRepository } from '../../../../user/domain/repositories/user.repository.interface';
import { IHashService } from '../../services/hash.service';
import { RegisterCommand } from './register.command';
import { RegisterResult } from './register.result';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements
    ICommandHandler<RegisterCommand>,
    ICommand<RegisterCommand, RegisterResult>
{
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
    @Inject(IHashService) private readonly hashService: IHashService,
  ) {}

  async execute(command: RegisterCommand): Promise<RegisterResult> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.hashService.hash(command.password);

    const userToSave = User.create('', {
      email: command.email,
      password: hashedPassword,
      role: command.role,
      isActive: true,
      isVerified: false,
      isFlag: false,
      reportCount: 0,
      createdAt: new Date(),
    });

    const savedUser = await this.userRepository.save(userToSave);

    const profileToSave = Profile.create('', {
      userId: savedUser.id,
      nickname: command.nickname,
      phone: command.phone,
      dateOfBirth: command.dateOfBirth,
    });

    await this.profileRepository.save(profileToSave);

    return { userId: savedUser.id };
  }
}
