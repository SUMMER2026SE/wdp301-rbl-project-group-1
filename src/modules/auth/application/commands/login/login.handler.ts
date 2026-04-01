import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '../../../../../shared/domain/exceptions/domain-exception';
import { IUserRepository } from '../../../../user/domain/repositories/user.repository.interface';
import { IHashService } from '../../services/hash.service';
import { IJwtService } from '../../services/jwt.service';
import { LoginCommand } from './login.command';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly jwtService: IJwtService,
  ) {}

  async execute(command: LoginCommand): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch = await this.hashService.compare(
      command.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }
}
