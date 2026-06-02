import {
  Inject,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as crypto from 'crypto';
import { AuthTokenPayload } from 'src/modules/auth/domain/value-objects/auth-token-payload';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
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

    // Step 1: Verify JWT signature and expiry
    try {
      payload = await jwtService.verifyRefresh<AuthTokenPayload>(
        command.refreshToken,
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Step 2: Find the stored token record
    const storedRefreshToken =
      await this.authRepository.findRefreshTokenByToken(command.refreshToken);

    if (!storedRefreshToken) {
      console.error('Refresh token failed: token not found in database', {
        token: command.refreshToken,
      });
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    if (storedRefreshToken.isExpired()) {
      console.error('Refresh token failed: token expired', {
        expiresAt: storedRefreshToken.expiresAt,
      });
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    if (storedRefreshToken.userId !== payload.sub) {
      console.error('Refresh token failed: user mismatch', {
        tokenUserId: storedRefreshToken.userId,
        payloadSub: payload.sub,
      });
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Step 3: Atomically revoke the old token (race-condition safe).
    const wasRevoked = await this.authRepository.atomicRevokeRefreshToken(
      storedRefreshToken.id,
    );

    if (!wasRevoked) {
      console.error(
        'Refresh token failed: token was already revoked (race condition detected)',
        { tokenId: storedRefreshToken.id },
      );
      // Token was already revoked by a concurrent request (e.g. multiple tabs).
      // Return 409 Conflict so the frontend knows to retry the refresh with the new cookie.
      throw new ConflictException('Refresh token race condition detected');
    }

    // We no longer revoke all other tokens here to allow multi-device support.
    // Cleanup of stale tokens should be handled by a cron job or during logout/reset.

    // Step 4: Load user
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Step 5: Issue new token pair
    const tokenPayload: AuthTokenPayload = {
      sub: String(user.id),
      email: user.email,
      role: user.role,
    };

    const accessToken = await jwtService.sign(tokenPayload);
    const refreshToken = await jwtService.signRefresh({
      ...tokenPayload,
      jti: crypto.randomUUID(),
    });

    const refreshPayload = await jwtService.verifyRefresh<
      AuthTokenPayload & { exp?: number }
    >(refreshToken);

    const expiresAt = refreshPayload.exp
      ? new Date(refreshPayload.exp * 1000)
      : new Date();

    // Step 6: Persist the new refresh token.
    // Note: id is intentionally omitted (empty string) so the repository creates
    // a new record rather than trying to update an existing one.
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
