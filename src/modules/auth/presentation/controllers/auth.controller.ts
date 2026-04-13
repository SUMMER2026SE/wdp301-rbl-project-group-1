import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { LoginResult } from 'src/modules/auth/application/commands/login/login.result';
import { RegisterResult } from 'src/modules/auth/application/commands/register/register.result';
import {
  ApiCreatedResponseWrapped,
  ApiOkResponseWrappedNoData,
} from 'src/shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { LoginCommand } from '../../application/commands/login/login.command';
import { LogoutCommand } from '../../application/commands/logout/logout.command';
import { RefreshTokenCommand } from '../../application/commands/refresh-token/refresh-token.command';
import { RefreshTokenResult } from '../../application/commands/refresh-token/refresh-token.result';
import { RegisterCommand } from '../../application/commands/register/register.command';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';
import { AuthTokenPairDto, RegisterResultDto } from '../dto/auth-response.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ operationId: 'register', summary: 'Register a new user' })
  @ApiCreatedResponseWrapped(RegisterResultDto, {
    description: 'User successfully registered.',
  })
  @ApiResponse({
    status: 400,
    description: 'Email already exists or invalid data.',
  })
  async register(
    @Body() dto: RegisterDto,
  ): Promise<BaseResponse<RegisterResult>> {
    const result = await this.commandBus.execute<
      RegisterCommand,
      RegisterResult
    >(new RegisterCommand(dto.email, dto.password, dto.role, dto.nickname));
    return BaseResponse.ok(result);
  }

  @Public()
  @Post('login')
  @ApiOperation({
    operationId: 'login',
    summary: 'Login and receive access token + refresh token cookie',
  })
  @ApiCreatedResponseWrapped(AuthTokenPairDto, {
    description: 'User successfully logged in.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / Invalid credentials.',
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<BaseResponse<LoginResult>> {
    const result = await this.commandBus.execute<LoginCommand, LoginResult>(
      new LoginCommand(dto.email, dto.password),
    );

    this.setRefreshTokenCookie(res, result.refreshToken);

    return BaseResponse.ok({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }

  @Public()
  @Post('refresh')
  @ApiOperation({
    operationId: 'refresh',
    summary: 'Refresh access token using refresh token cookie',
  })
  @ApiCreatedResponseWrapped(AuthTokenPairDto, {
    description: 'New access token issued.',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token.',
  })
  async refresh(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<BaseResponse<RefreshTokenResult>> {
    const refreshToken = (req.cookies as Record<string, string | undefined>)
      ?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const result = await this.commandBus.execute<
      RefreshTokenCommand,
      RefreshTokenResult
    >(new RefreshTokenCommand(refreshToken));

    this.setRefreshTokenCookie(res, result.refreshToken);

    return BaseResponse.ok({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'logout',
    summary: 'Logout and clear refresh token cookie',
  })
  @ApiOkResponseWrappedNoData({
    description: 'User successfully logged out.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async logout(
    @CurrentUser() user: { userId: string },
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<BaseResponse<null>> {
    const refreshToken = (req.cookies as Record<string, string | undefined>)
      ?.refresh_token;

    await this.commandBus.execute<LogoutCommand, void>(
      new LogoutCommand(user.userId, refreshToken),
    );

    void res.clearCookie('refresh_token', {
      path: '/',
    });

    return BaseResponse.ok(null, 'User successfully logged out.');
  }

  private setRefreshTokenCookie(res: FastifyReply, refreshToken: string): void {
    const cookieExpiresDays =
      this.configService.get<string>('auth.cookieExpires') ?? '30d';
    const days = parseInt(cookieExpiresDays, 10) || 30;

    void res.setCookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: days * 24 * 60 * 60,
      path: '/',
    });
  }
}
