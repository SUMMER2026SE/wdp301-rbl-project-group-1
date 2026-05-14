import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

const ResourceTypeEnum = z.enum(['FILE', 'VIDEO', 'LINK', 'DOCUMENT']);

export const CreateResourceSchema = z
  .object({
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
  })
  .meta({ id: 'CreateResourceDto' });

export class CreateResourceDto extends createZodDto(CreateResourceSchema) {}
