import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { UserRole } from '../../../../shared/domain/enums/enums';

extendZodWithOpenApi(z);

export const RegisterResultSchema = z
  .object({
    userId: z.string().meta({
      description: 'Created user id',
      example: '6d84c88b-1bcf-4f58-bbb0-cdd12ca2f8b4',
    }),
  })
  .meta({ id: 'RegisterResultDto' });

export class RegisterResultDto extends createZodDto(RegisterResultSchema) {}

export const RegisterResponseSchema = z
  .object({
    success: z.boolean().meta({ example: true }),
    message: z.string().meta({ example: 'Success' }),
    data: RegisterResultSchema,
  })
  .meta({ id: 'RegisterResponseDto' });

export class RegisterResponseDto extends createZodDto(RegisterResponseSchema) {}

export const AuthTokenPairSchema = z
  .object({
    accessToken: z.string().meta({
      description: 'JWT access token',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access.payload.signature',
    }),
    refreshToken: z.string().meta({
      description: 'Refresh token used to rotate access token',
      example: '2c47b8fd-7135-4709-bccf-3e5f2f7aa890',
    }),
  })
  .meta({ id: 'AuthTokenPairDto' });

export class AuthTokenPairDto extends createZodDto(AuthTokenPairSchema) {}

export const LoginUserSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    email: z.string().email().meta({ example: 'user@example.com' }),
    role: z.nativeEnum(UserRole).meta({ example: UserRole.STUDENT }),
    nickname: z.string().meta({ example: 'JohnDoe' }),
    isActive: z.boolean().meta({ example: true }),
    isVerified: z.boolean().meta({ example: true }),
    createdAt: z.string().datetime().meta({
      example: '2025-01-01T00:00:00.000Z',
    }),
  })
  .meta({ id: 'LoginUserDto' });

export class LoginUserDto extends createZodDto(LoginUserSchema) {}

export const MeUserSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    email: z.string().email().meta({ example: 'user@example.com' }),
    role: z.nativeEnum(UserRole).meta({ example: UserRole.STUDENT }),
    nickname: z.string().meta({ example: 'JohnDoe' }),
    isActive: z.boolean().meta({ example: true }),
    isVerified: z.boolean().meta({ example: true }),
    isFlag: z.boolean().meta({ example: false }),
    reportCount: z.number().int().meta({ example: 0 }),
    createdAt: z.string().datetime().meta({
      example: '2025-01-01T00:00:00.000Z',
    }),
  })
  .meta({ id: 'MeUserDto' });

export class MeUserDto extends createZodDto(MeUserSchema) {}

export const LoginResponseSchema = z
  .object({
    accessToken: z.string().meta({
      description: 'JWT access token',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access.payload.signature',
    }),
    refreshToken: z.string().meta({
      description: 'Refresh token used to rotate access token',
      example: '2c47b8fd-7135-4709-bccf-3e5f2f7aa890',
    }),
    user: LoginUserSchema,
  })
  .meta({ id: 'LoginResponseDto' });

export class LoginResponseDto extends createZodDto(LoginResponseSchema) {}
