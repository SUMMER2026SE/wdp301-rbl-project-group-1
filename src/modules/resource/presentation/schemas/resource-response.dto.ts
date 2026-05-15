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
