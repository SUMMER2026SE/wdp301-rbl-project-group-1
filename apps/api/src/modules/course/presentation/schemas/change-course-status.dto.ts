import { createZodDto } from 'nestjs-zod';
import { CourseStatus } from '../../../../shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const ChangeCourseStatusSchema = z
  .object({
    status: z.enum(Object.values(CourseStatus)).meta({
      example: 'PUBLISHED',
      description: 'The status of the course',
    }),
  })
  .meta({ id: 'ChangeCourseStatusDto' });

export class ChangeCourseStatusDto extends createZodDto(
  ChangeCourseStatusSchema,
) {}
