import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthTokenPayload } from 'src/modules/auth/domain/value-objects/auth-token-payload';
import { UnauthorizedException } from '../../../../../shared/domain/exceptions/domain-exception';
import { IProfileRepository } from '../../../../user/domain/repositories/profile.repository.interface';
import { IUserRepository } from '../../../../user/domain/repositories/user.repository.interface';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { IAuthRepository } from '../../../domain/repositories/auth.repository.interface';
import { IHashService } from '../../services/hash.service';
import { IJwtService, type JwtServicePort } from '../../services/jwt.service';
import { LoginCommand } from './login.command';
import { LoginResult } from './login.result';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly profileRepository: IProfileRepository,
    private readonly authRepository: IAuthRepository,
    private readonly hashService: IHashService,
    private readonly jwtService: IJwtService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const jwtService = this.jwtService as JwtServicePort;
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

    const payload: AuthTokenPayload = {
      sub: String(user.id),
      role: user.role,
    };

    const profile = await this.profileRepository.findByUserId(user.id);

    const accessToken = await jwtService.sign(payload);
    const refreshToken = await jwtService.signRefresh(payload);

    const refreshPayload = await jwtService.verifyRefresh<
      AuthTokenPayload & { exp?: number }
    >(refreshToken);
    const expiresAt = refreshPayload.exp
      ? new Date(refreshPayload.exp * 1000)
      : new Date();

    const refreshTokenToSave = RefreshToken.create('', {
      userId: user.id,
      token: refreshToken,
      expiresAt,
      createdAt: new Date(),
      revoked: false,
      user,
    });

    await this.authRepository.saveRefreshToken(refreshTokenToSave);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        nickname: profile?.nickname ?? '',
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    };
  }
}
