import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';

export class RegisterResultDto {
  @ApiProperty({
    description: 'Created user id',
    example: '6d84c88b-1bcf-4f58-bbb0-cdd12ca2f8b4',
  })
  userId!: string;
}

export class RegisterResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Success' })
  message!: string;

  @ApiProperty({ type: () => RegisterResultDto })
  data!: RegisterResultDto;
}

export class AuthTokenPairDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access.payload.signature',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'Refresh token used to rotate access token',
    example: '2c47b8fd-7135-4709-bccf-3e5f2f7aa890',
  })
  refreshToken!: string;
}

export class UserDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT })
  role!: UserRole;

  @ApiProperty({ example: 'JohnDoe' })
  nickname!: string;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ example: true })
  isVerified!: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt!: Date;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access.payload.signature',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'Refresh token used to rotate access token',
    example: '2c47b8fd-7135-4709-bccf-3e5f2f7aa890',
  })
  refreshToken!: string;

  @ApiProperty({ type: () => UserDto })
  user!: UserDto;
}
