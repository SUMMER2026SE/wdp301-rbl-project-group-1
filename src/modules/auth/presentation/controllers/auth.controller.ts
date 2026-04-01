import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { BaseResponse } from '../../../../shared/application/common/base-response';
import { LoginCommand } from '../../application/commands/login/login.command';
import { RegisterCommand } from '../../application/commands/register/register.command';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({
    status: 400,
    description: 'Email already exists or invalid data.',
  })
  async register(@Body() dto: RegisterDto): Promise<BaseResponse<string>> {
    const result = await this.commandBus.execute<RegisterCommand, string>(
      new RegisterCommand(dto.email, dto.password, dto.role, dto.nickname),
    );
    return BaseResponse.ok(result);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user and return access token' })
  @ApiResponse({ status: 201, description: 'User successfully logged in.' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / Invalid credentials.',
  })
  async login(
    @Body() dto: LoginDto,
  ): Promise<BaseResponse<{ accessToken: string }>> {
    const result = await this.commandBus.execute<
      LoginCommand,
      { accessToken: string }
    >(new LoginCommand(dto.email, dto.password));
    return BaseResponse.ok(result);
  }
}
