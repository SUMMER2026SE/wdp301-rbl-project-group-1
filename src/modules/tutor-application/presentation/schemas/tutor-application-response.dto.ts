import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { CreateTutorApplicationResult } from '../../application/command/create-tutor-application/create-tutor-application.result';

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
