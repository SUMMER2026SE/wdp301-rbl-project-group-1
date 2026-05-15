import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const CreateResourceResultSchema = z
  .object({
    id: z.string().meta({
      description: 'The ID of the newly created resource',
      example: 'clhg12345000008l4f1h5g6i7',
    }),
  })
  .meta({ id: 'CreateResourceResultDto' });

export class CreateResourceResultDto extends createZodDto(
  CreateResourceResultSchema,
) {}

export const AssignResourceResultSchema = z
  .object({
    resourceIds: z.array(z.string()).meta({
      description: 'The IDs of the assigned resources',
      example: ['clhg12345000008l4f1h5g6i7'],
    }),
  })
  .meta({ id: 'AssignResourceResultDto' });

export class AssignResourceResultDto extends createZodDto(
  AssignResourceResultSchema,
) {}

export const ResourceResponseSchema = z
  .object({
    id: z.string().meta({ example: 'clhg12345000008l4f1h5g6i7' }),
    userId: z.string().meta({ example: 'clhg12345000008l4f1h5g6i7' }),
    name: z.string().meta({ example: 'Lecture Slides' }),
    url: z.string().meta({ example: 'https://example.com/slides.pdf' }),
    type: z
      .enum(['FILE', 'VIDEO', 'LINK', 'DOCUMENT'])
      .meta({ example: 'FILE' }),
    size: z.number().nullable().meta({ example: 1024000 }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2025-01-01T00:00:00.000Z' }),
    updatedAt: z
      .string()
      .datetime()
      .meta({ example: '2025-01-01T00:00:00.000Z' }),
  })
  .meta({ id: 'ResourceResponseDto' });

export class ResourceResponseDto extends createZodDto(
  ResourceResponseSchema,
) {}
