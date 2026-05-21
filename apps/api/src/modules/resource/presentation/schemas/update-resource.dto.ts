import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

const ResourceTypeEnum = z.enum(['FILE', 'VIDEO', 'LINK', 'DOCUMENT']);
const AssignTargetEnum = z.enum(['COURSE', 'LESSON']);
const UpdateActionEnum = z.enum(['ASSIGN', 'UNASSIGN', 'REPLACE']);

const NewResourceSchema = z.object({
  name: z.string().min(1).meta({
    example: 'Lecture Notes Chapter 1',
    description: 'The name of the resource',
  }),
  url: z.string().url().meta({
    example: 'https://storage.example.com/files/lecture-notes-ch1.pdf',
    description: 'The URL of the resource',
  }),
  type: ResourceTypeEnum.meta({
    example: 'DOCUMENT',
    description: 'The type of the resource',
  }),
  size: z.number().int().min(0).optional().meta({
    example: 1048576,
    description: 'The size of the resource in bytes',
  }),
});

export const UpdateResourceSchema = z
  .object({
    action: UpdateActionEnum.meta({
      example: 'ASSIGN',
      description:
        'ASSIGN — attach resources to the target; UNASSIGN — detach resources from the target; REPLACE — remove all current assignments then attach the given ones',
    }),
    targetType: AssignTargetEnum.meta({
      example: 'COURSE',
      description: 'Target entity type: COURSE or LESSON',
    }),
    targetId: z.string().min(1).meta({
      example: 'clhg12345000008l4f1h5g6i7',
      description: 'The ID of the course or lesson',
    }),
    resourceIds: z
      .array(z.string().min(1))
      .optional()
      .meta({
        example: ['clhg12345000008l4f1h5g6i8'],
        description: 'IDs of existing resources',
      }),
    resources: z.array(NewResourceSchema).optional().meta({
      description:
        'New resources data — each will be created and assigned (ignored for UNASSIGN)',
    }),
  })
  .meta({ id: 'UpdateResourceDto' });

export class UpdateResourceDto extends createZodDto(UpdateResourceSchema) {}
