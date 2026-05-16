import { createZodDto } from 'nestjs-zod';
import { EnrollmentStatus } from '../../../../shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

const EnrollmentStatusEnum = z.enum(EnrollmentStatus);

export const EnrollCourseResultSchema = z
  .object({
    id: z
      .string()
      .meta({ description: 'Enrollment ID', example: 'clhg12345000008l4f1h5g6i7' }),
    status: EnrollmentStatusEnum.meta({ example: 'PENDING' }),
    enrolledAt: z
      .string()
      .datetime()
      .meta({ example: '2026-05-16T08:00:00.000Z' }),
  })
  .meta({ id: 'EnrollCourseResultDto' });

export class EnrollCourseResultDto extends createZodDto(
  EnrollCourseResultSchema,
) {}
