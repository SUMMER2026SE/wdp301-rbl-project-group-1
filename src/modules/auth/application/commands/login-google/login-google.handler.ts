import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomBytes } from 'crypto';
import { AuthTokenPayload } from 'src/modules/auth/domain/value-objects/auth-token-payload';
import { AuthProvider, UserRole } from 'src/shared/domain/enums/enums';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { UnauthorizedException } from '../../../../../shared/domain/exceptions/domain-exception';
import { UserIdentity } from '../../../../user/domain/entities/user-identity.entity';
import { User } from '../../../../user/domain/entities/user.entity';
import { IProfileRepository } from '../../../../user/domain/repositories/profile.repository.interface';
import { IUserIdentityRepository } from '../../../../user/domain/repositories/user-identity.repository.interface';
import { IUserRepository } from '../../../../user/domain/repositories/user.repository.interface';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { IAuthRepository } from '../../../domain/repositories/auth.repository.interface';
import { GoogleOAuthService } from '../../../infrastructure/services/google-auth.service';
import { IHashService } from '../../services/hash.service';
import { IJwtService, type JwtServicePort } from '../../services/jwt.service';
import { LoginGoogleCommand } from './login-google.command';
import { LoginGoogleResult } from './login-google.result';

const GOOGLE_PROVIDER = 'GOOGLE' as AuthProvider;

@CommandHandler(LoginGoogleCommand)
export class LoginGoogleCommandHandler
  implements
    ICommandHandler<LoginGoogleCommand>,
    ICommand<LoginGoogleCommand, LoginGoogleResult>
{
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IUserIdentityRepository)
    private readonly userIdentityRepository: IUserIdentityRepository,
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
    @Inject(IAuthRepository) private readonly authRepository: IAuthRepository,
    @Inject(IHashService) private readonly hashService: IHashService,
    @Inject(IJwtService) private readonly jwtService: IJwtService,
    private readonly googleOAuthService: GoogleOAuthService,
  ) {}

  async execute(command: LoginGoogleCommand): Promise<LoginGoogleResult> {
    const jwtService = this.jwtService as JwtServicePort;
    const googleUser = await this.googleOAuthService.verifyToken(
      command.idToken,
    );

    if (!googleUser.email || !googleUser.googleId) {
      throw new UnauthorizedException('Invalid Google account');
    }

    let user: Awaited<ReturnType<IUserRepository['findById']>> = null;

    const existingIdentity =
      await this.userIdentityRepository.findByProviderAndProviderUserId(
        GOOGLE_PROVIDER,
        googleUser.googleId,
      );

    if (existingIdentity) {
      user = await this.userRepository.findById(existingIdentity.userId);
    }

    if (!user) {
      user = await this.userRepository.findByEmail(googleUser.email);
    }

    if (!user) {
      const generatedPassword = await this.hashService.hash(
        randomBytes(32).toString('hex'),
      );

      const userToSave = User.create('', {
        email: googleUser.email,
        password: generatedPassword,
        role: UserRole.STUDENT,
        isActive: true,
        isVerified: Boolean(googleUser.emailVerified),
        isFlag: false,
        reportCount: 0,
        createdAt: new Date(),
      });

      user = await this.userRepository.save(userToSave);
    } else if (googleUser.emailVerified && !user.isVerified) {
      user.verify();
      user = await this.userRepository.save(user);
    }

    const existingLinkedIdentity =
      await this.userIdentityRepository.findByUserIdAndProvider(
        user.id,
        GOOGLE_PROVIDER,
      );

    if (!existingLinkedIdentity) {
      await this.userIdentityRepository.save(
        UserIdentity.create('', {
          userId: user.id,
          provider: GOOGLE_PROVIDER,
          providerUserId: googleUser.googleId,
          email: googleUser.email,
          emailVerified: Boolean(googleUser.emailVerified),
          avatarUrl: googleUser.avatar ?? undefined,
          createdAt: new Date(),
        }),
      );
    }

    const payload: AuthTokenPayload = {
      sub: String(user.id),
      email: user.email,
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
        isFlag: user.isFlag,
        reportCount: user.reportCount,
        createdAt: user.createdAt,
      },
    };
  }
}
