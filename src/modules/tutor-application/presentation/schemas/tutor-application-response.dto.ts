import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { ApproveTutorApplicationResult } from '../../application/command/approve-tutor-application/approve-tutor-application.result';
import { CreateTutorApplicationResult } from '../../application/command/create-tutor-application/create-tutor-application.result';
import { RejectTutorApplicationResult } from '../../application/command/reject-tutor-application/reject-tutor-application.result';
import { TutorApplication } from '../../domain/entities/tutor-application.entity';

export const CreateTutorApplicationResponseSchema = z
  .object({
    id: z.string().meta({
      example: 'b3e123f3-8cc6-48f5-8849-43dc7b4a4f2f',
      description: 'Tutor application ID',
    }),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).meta({
      example: 'PENDING',
      description: 'Tutor application status',
    }),
    createdAt: z.string().datetime().meta({
      example: '2026-04-28T10:00:00.000Z',
      description: 'Creation time of application',
    }),
  })
  .meta({ id: 'CreateTutorApplicationResponseDto' });

export class CreateTutorApplicationResponseDto extends createZodDto(
  CreateTutorApplicationResponseSchema,
) {
  static fromResult(
    result: CreateTutorApplicationResult,
  ): CreateTutorApplicationResponseDto {
    const dto = new CreateTutorApplicationResponseDto();
    dto.id = result.id;
    dto.status = result.status;
    dto.createdAt = result.createdAt.toISOString();
    return dto;
  }
}

export const TutorApplicationResponseSchema = z
  .object({
    id: z.string(),
    email: z.string().email(),
    bio: z.string().nullable().optional(),
    specialization: z.string(),
    experience: z.number().nullable().optional(),
    education: z.string().nullable().optional(),
    pricePerHour: z.number().nullable().optional(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .meta({ id: 'TutorApplicationResponseDto' });

export class TutorApplicationResponseDto extends createZodDto(
  TutorApplicationResponseSchema,
) {
  static fromEntity(entity: TutorApplication): TutorApplicationResponseDto {
    const dto = new TutorApplicationResponseDto();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.bio = entity.bio;
    dto.specialization = entity.specialization;
    dto.experience = entity.experience;
    dto.education = entity.education;
    dto.pricePerHour = entity.pricePerHour;
    dto.status = entity.status;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}

export const ApproveTutorApplicationResponseSchema = z
  .object({
    applicationId: z.string().meta({
      example: 'b3e123f3-8cc6-48f5-8849-43dc7b4a4f2f',
      description: 'Tutor application ID',
    }),
    userId: z.string().meta({
      example: 'c1d234e5-9ff7-41a6-b321-54ec8b5a5g3g',
      description: 'Newly created tutor user ID',
    }),
    email: z.string().email().meta({
      example: 'tutor@example.com',
      description: 'Tutor email',
    }),
    temporaryPassword: z.string().meta({
      example: 'a1b2c3d4e5f6g7h8',
      description:
        'Temporary password for the new tutor account (send via email)',
    }),
  })
  .meta({ id: 'ApproveTutorApplicationResponseDto' });

export class ApproveTutorApplicationResponseDto extends createZodDto(
  ApproveTutorApplicationResponseSchema,
) {
  static fromResult(
    result: ApproveTutorApplicationResult,
  ): ApproveTutorApplicationResponseDto {
    const dto = new ApproveTutorApplicationResponseDto();
    dto.applicationId = result.applicationId;
    dto.userId = result.userId;
    dto.email = result.email;
    dto.temporaryPassword = result.temporaryPassword;
    return dto;
  }
}

export const RejectTutorApplicationResponseSchema = z
  .object({
    applicationId: z.string().meta({
      example: 'b3e123f3-8cc6-48f5-8849-43dc7b4a4f2f',
      description: 'Tutor application ID',
    }),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).meta({
      example: 'REJECTED',
      description: 'Updated application status',
    }),
  })
  .meta({ id: 'RejectTutorApplicationResponseDto' });

export class RejectTutorApplicationResponseDto extends createZodDto(
  RejectTutorApplicationResponseSchema,
) {
  static fromResult(
    result: RejectTutorApplicationResult,
  ): RejectTutorApplicationResponseDto {
    const dto = new RejectTutorApplicationResponseDto();
    dto.applicationId = result.applicationId;
    dto.status = result.status as 'PENDING' | 'APPROVED' | 'REJECTED';
    return dto;
  }
}
