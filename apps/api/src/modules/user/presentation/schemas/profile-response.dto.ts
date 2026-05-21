import { createZodDto } from 'nestjs-zod';
import { Gender } from 'src/shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { Profile } from '../../domain/entities/profile.entity';

export const ProfileResponseSchema = z
  .object({
    nickname: z
      .string()
      .optional()
      .meta({ example: 'johndoe', description: 'Nickname' }),
    avatarUrl: z.string().url().optional().meta({
      example: 'https://example.com/avatar.jpg',
      description: 'Avatar URL',
    }),
    phone: z
      .string()
      .optional()
      .meta({ example: '+1234567890', description: 'Phone number' }),
    dateOfBirth: z
      .string()
      .date()
      .optional()
      .meta({ example: '1990-01-01', description: 'Date of birth' }),
    gender: z
      .nativeEnum(Gender)
      .optional()
      .meta({ example: Gender.MALE, description: 'Gender' }),
    address: z
      .string()
      .optional()
      .meta({ example: '123 Main St', description: 'Address' }),
  })
  .meta({ id: 'ProfileResponseDto' });

export class ProfileResponseDto extends createZodDto(ProfileResponseSchema) {
  static fromDomain(profile: Profile): ProfileResponseDto {
    const dto = new ProfileResponseDto();
    dto.nickname = profile.nickname;
    dto.avatarUrl = profile.avatarUrl;
    dto.phone = profile.phone;
    dto.dateOfBirth = profile.dateOfBirth
      ? profile.dateOfBirth.toISOString().slice(0, 10)
      : undefined;
    dto.gender = profile.gender;
    dto.address = profile.address;
    return dto;
  }
}

export const UpdateProfileResultSchema = z
  .object({
    id: z.string().meta({
      example: 'cm9x8v7w60000abc123def456',
      description: 'User id',
    }),
    message: z.string().meta({
      example: 'Profile updated successfully',
      description: 'Result message',
    }),
  })
  .meta({ id: 'UpdateProfileResultDto' });

export class UpdateProfileResultDto extends createZodDto(
  UpdateProfileResultSchema,
) {}
