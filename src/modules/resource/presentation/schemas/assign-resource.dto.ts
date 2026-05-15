import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

const ResourceTypeEnum = z.enum(['FILE', 'VIDEO', 'LINK', 'DOCUMENT']);
const AssignTargetEnum = z.enum(['COURSE', 'LESSON']);

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

export const AssignResourceSchema = z
  .object({
    targetType: AssignTargetEnum.meta({
      example: 'COURSE',
      description: 'Assign to COURSE or LESSON',
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
        description: 'IDs of existing resources to assign',
      }),
    resources: z.array(NewResourceSchema).optional().meta({
      description: 'New resources data — each will be created and assigned',
    }),
  })
  .refine(
    (data) =>
      (data.resourceIds?.length ?? 0) + (data.resources?.length ?? 0) > 0,
    {
      message: 'At least one resourceId or resource must be provided',
    },
  )
  .meta({ id: 'AssignResourceDto' });

export class AssignResourceDto extends createZodDto(AssignResourceSchema) {}
