import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
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
  ApiOkResponseWrapped,
  ApiOkResponseWrappedNoData,
} from 'src/shared/presentation/decorators/api-response.decorator';
import { RateLimit } from 'src/shared/presentation/decorators/rate-limit.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { ForgotPasswordCommand } from '../../application/commands/forgot-password/forgot-password.command';
import { ForgotPasswordResult } from '../../application/commands/forgot-password/forgot-password.result';
import { LoginGoogleCommand } from '../../application/commands/login-google/login-google.command';
import { LoginGoogleResult } from '../../application/commands/login-google/login-google.result';
import { LoginCommand } from '../../application/commands/login/login.command';
import { LogoutCommand } from '../../application/commands/logout/logout.command';
import { RefreshTokenCommand } from '../../application/commands/refresh-token/refresh-token.command';
import { RefreshTokenResult } from '../../application/commands/refresh-token/refresh-token.result';
import { RegisterCommand } from '../../application/commands/register/register.command';
import { ResetPasswordCommand } from '../../application/commands/reset-password/reset-password.command';
import { ResetPasswordResult } from '../../application/commands/reset-password/reset-password.result';
import { SendVerifyEmailOtpCommand } from '../../application/commands/send-verify-email-otp/send-verify-email-otp.command';
import { SendVerifyEmailOtpResult } from '../../application/commands/send-verify-email-otp/send-verify-email-otp.result';
import { VerifyEmailCommand } from '../../application/commands/verify-email/verify-email.command';
import { VerifyEmailResult } from '../../application/commands/verify-email/verify-email.result';
import { VerifyOtpCommand } from '../../application/commands/verify-otp/verify-otp.command';
import { VerifyOtpResult } from '../../application/commands/verify-otp/verify-otp.result';
import { GetMeQuery } from '../../application/queries/get-me/get-me.query';
import { GetMeResult } from '../../application/queries/get-me/get-me.result';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';
import { ResetTokenGuard } from '../guards/reset-token.guard';
import {
  AuthTokenPairDto,
  ForgotPasswordResultDto,
  LoginResponseDto,
  MeUserDto,
  RegisterResultDto,
  ResetPasswordResultDto,
  SendVerifyEmailOtpResultDto,
  VerifyEmailResultDto,
  VerifyOtpResultDto,
} from '../schemas/auth-response.dto';
import { ForgotPasswordDto } from '../schemas/forgot-password.dto';
import { LoginGoogleDto } from '../schemas/login-google.dto';
import { LoginDto } from '../schemas/login.dto';
import { RegisterDto } from '../schemas/register.dto';
import { ResetPasswordDto } from '../schemas/reset-password.dto';
import { SendVerifyEmailOtpDto } from '../schemas/send-verify-email-otp.dto';
import { VerifyEmailDto } from '../schemas/verify-email.dto';
import { VerifyOtpDto } from '../schemas/verify-otp.dto';

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
    >(
      new RegisterCommand(
        dto.email,
        dto.password,
        dto.role,
        dto.nickname,
        dto.phone,
        new Date(dto.dateOfBirth),
        dto.studentData
          ? {
              school: dto.studentData.school,
              learningGoal: dto.studentData.learningGoal,
              subjectIds: dto.studentData.subjectIds,
              gradeIds: dto.studentData.gradeIds,
            }
          : undefined,
      ),
    );

    // Automatically send verification OTP after registration
    try {
      await this.commandBus.execute<
        SendVerifyEmailOtpCommand,
        SendVerifyEmailOtpResult
      >(new SendVerifyEmailOtpCommand(dto.email));
    } catch {
      // Don't fail registration if OTP sending fails
    }

    return BaseResponse.ok(result);
  }

  @Public()
  @Post('login')
  @RateLimit(5, 60)
  @ApiOperation({
    operationId: 'login',
    summary: 'Login and receive access token + refresh token cookie',
  })
  @ApiCreatedResponseWrapped(LoginResponseDto, {
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
      user: result.user,
    });
  }

  @Public()
  @Post('login-google')
  @RateLimit(5, 60)
  @ApiOperation({
    operationId: 'loginGoogle',
    summary:
      'Login with Google ID token and receive access token + refresh token cookie',
  })
  @ApiCreatedResponseWrapped(LoginResponseDto, {
    description: 'User successfully logged in with Google.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / Invalid Google token.',
  })
  async loginGoogle(
    @Body() dto: LoginGoogleDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<BaseResponse<LoginGoogleResult>> {
    const result = await this.commandBus.execute<
      LoginGoogleCommand,
      LoginGoogleResult
    >(new LoginGoogleCommand(dto.idToken));

    this.setRefreshTokenCookie(res, result.refreshToken);

    return BaseResponse.ok({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
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

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'getMe',
    summary: 'Get current user basic information',
  })
  @ApiOkResponseWrapped(MeUserDto, {
    description: 'Current user information returned successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMe(
    @CurrentUser() user: { userId: string },
  ): Promise<BaseResponse<GetMeResult>> {
    const result = await this.queryBus.execute<GetMeQuery, GetMeResult>(
      new GetMeQuery(user.userId),
    );

    return BaseResponse.ok(result);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({
    operationId: 'forgotPassword',
    summary: 'Send an OTP for password reset',
  })
  @ApiOkResponseWrapped(ForgotPasswordResultDto, {
    description: 'OTP sent to email successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'User with this email does not exist.',
  })
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<BaseResponse<ForgotPasswordResult>> {
    const result = await this.commandBus.execute<
      ForgotPasswordCommand,
      ForgotPasswordResult
    >(new ForgotPasswordCommand(dto.email));

    return BaseResponse.ok(result);
  }

  @Public()
  @Post('verify-otp')
  @ApiOperation({
    operationId: 'verifyOtp',
    summary: 'Verify OTP code for password reset',
  })
  @ApiOkResponseWrapped(VerifyOtpResultDto, {
    description: 'OTP verified successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or expired.',
  })
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
  ): Promise<BaseResponse<VerifyOtpResult>> {
    const result = await this.commandBus.execute<
      VerifyOtpCommand,
      VerifyOtpResult
    >(new VerifyOtpCommand(dto.email, dto.code));

    return BaseResponse.ok(result);
  }

  @Public()
  @Post('send-verify-email-otp')
  @RateLimit(3, 60)
  @ApiOperation({
    operationId: 'sendVerifyEmailOtp',
    summary: 'Send an OTP to verify user email address',
  })
  @ApiOkResponseWrapped(SendVerifyEmailOtpResultDto, {
    description: 'Verification OTP sent to email successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'User not found or email already verified.',
  })
  async sendVerifyEmailOtp(
    @Body() dto: SendVerifyEmailOtpDto,
  ): Promise<BaseResponse<SendVerifyEmailOtpResult>> {
    const result = await this.commandBus.execute<
      SendVerifyEmailOtpCommand,
      SendVerifyEmailOtpResult
    >(new SendVerifyEmailOtpCommand(dto.email));

    return BaseResponse.ok(result);
  }

  @Public()
  @Post('verify-email')
  @ApiOperation({
    operationId: 'verifyEmail',
    summary: 'Verify email address using OTP code',
  })
  @ApiOkResponseWrapped(VerifyEmailResultDto, {
    description: 'Email verified successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or expired.',
  })
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
  ): Promise<BaseResponse<VerifyEmailResult>> {
    const result = await this.commandBus.execute<
      VerifyEmailCommand,
      VerifyEmailResult
    >(new VerifyEmailCommand(dto.email, dto.code));

    return BaseResponse.ok(result);
  }

  @Public()
  @Post('reset-password')
  @UseGuards(ResetTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'resetPassword',
    summary: 'Reset user password using reset token in Authorization header',
  })
  @ApiOkResponseWrapped(ResetPasswordResultDto, {
    description: 'Password has been successfully reset.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid reset token or user not found.',
  })
  async resetPassword(
    @CurrentUser() user: { email: string },
    @Body() dto: ResetPasswordDto,
  ): Promise<BaseResponse<ResetPasswordResult>> {
    const result = await this.commandBus.execute<
      ResetPasswordCommand,
      ResetPasswordResult
    >(new ResetPasswordCommand(user.email, dto.newPassword));

    return BaseResponse.ok(result);
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
