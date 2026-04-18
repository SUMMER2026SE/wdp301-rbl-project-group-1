import { createZodDto } from 'nestjs-zod';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { User } from '../../domain/entities/user.entity';

export const UserResponseSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    email: z.string().email().meta({ example: 'user@example.com' }),
    role: z.nativeEnum(UserRole).meta({ example: UserRole.STUDENT }),
    nickname: z.string().nullable().meta({ example: 'JohnDoe' }),
    isActive: z.boolean().meta({ example: true }),
    isVerified: z.boolean().meta({ example: false }),
    isFlag: z.boolean().meta({ example: false }),
    reportCount: z.number().int().meta({ example: 0 }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2025-01-01T00:00:00.000Z' }),
  })
  .meta({ id: 'UserResponseDto' });

export class UserResponseDto extends createZodDto(UserResponseSchema) {
  static fromDomain(
    user: User,
    nickname: string | null = null,
  ): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.role = user.role;
    dto.nickname = nickname;
    dto.isActive = user.isActive;
    dto.isVerified = user.isVerified;
    dto.isFlag = user.isFlag;
    dto.reportCount = user.reportCount;
    dto.createdAt = user.createdAt.toISOString();
    return dto;
  }
}

export const UsersListResponseSchema = z
  .object({
    success: z.boolean().meta({ example: true }),
    message: z.string().meta({ example: 'Success' }),
    data: z.array(UserResponseSchema).nullable(),
  })
  .meta({ id: 'UsersListResponseDto' });

export class UsersListResponseDto extends createZodDto(
  UsersListResponseSchema,
) {}
