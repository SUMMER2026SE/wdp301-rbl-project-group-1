import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const CreateReviewSchema = z
  .object({
    rating: z
      .number()
      .int()
      .min(1)
      .max(5)
      .meta({ example: 5, description: 'Rating from 1 to 5' }),
    comment: z.string().trim().max(1000).optional().nullable().meta({
      example: 'Very helpful tutor, easy to understand explanations.',
    }),
  })
  .meta({ id: 'CreateReviewDto' });

export class CreateReviewDto extends createZodDto(CreateReviewSchema) {}
