import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '../../../../../shared/domain/exceptions/domain-exception';
import { User } from '../../../../user/domain/entities/user.entity';
import { IUserRepository } from '../../../../user/domain/repositories/user.repository.interface';
import { IHashService } from '../../services/hash.service';
import { RegisterCommand } from './register.command';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
  ) {}

  async execute(command: RegisterCommand): Promise<string> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.hashService.hash(command.password);

    const userToSave = User.create(0, {
      email: command.email,
      password: hashedPassword,
      role: command.role,
      nickname: command.nickname,
      isActive: true,
      isVerified: false,
      isFlag: false,
      reportCount: 0,
      createdAt: new Date(),
    });

    const savedUser = await this.userRepository.save(userToSave);

    return savedUser.id.toString();
  }
}
