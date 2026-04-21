import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthTokenPayload } from 'src/modules/auth/domain/value-objects/auth-token-payload';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { UnauthorizedException } from '../../../../../shared/domain/exceptions/domain-exception';
import { IUserRepository } from '../../../../user/domain/repositories/user.repository.interface';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { IAuthRepository } from '../../../domain/repositories/auth.repository.interface';
import { IJwtService, type JwtServicePort } from '../../services/jwt.service';
import { RefreshTokenCommand } from './refresh-token.command';
import { RefreshTokenResult } from './refresh-token.result';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler
  implements
    ICommandHandler<RefreshTokenCommand>,
    ICommand<RefreshTokenCommand, RefreshTokenResult>
{
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IAuthRepository) private readonly authRepository: IAuthRepository,
    @Inject(IJwtService) private readonly jwtService: IJwtService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    const jwtService = this.jwtService as JwtServicePort;
    let payload: AuthTokenPayload;

    try {
      payload = await jwtService.verifyRefresh<AuthTokenPayload>(
        command.refreshToken,
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const storedRefreshToken =
      await this.authRepository.findRefreshTokenByToken(command.refreshToken);
    if (
      !storedRefreshToken ||
      storedRefreshToken.revoked ||
      storedRefreshToken.isExpired() ||
      storedRefreshToken.userId !== payload.sub
    ) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    storedRefreshToken.revoke();
    await this.authRepository.saveRefreshToken(storedRefreshToken);

    const tokenPayload: AuthTokenPayload = {
      sub: String(user.id),
      role: user.role,
    };

    const accessToken = await jwtService.sign(tokenPayload);
    const refreshToken = await jwtService.signRefresh(tokenPayload);

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

    return { accessToken, refreshToken };
  }
}
