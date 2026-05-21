import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const UpdateStudentProfileSchema = z
  .object({
    school: z
      .string()
      .min(1)
      .nullable()
      .optional()
      .meta({ example: 'THPT Nguyễn Du', description: 'School name' }),
    learningGoal: z.string().min(1).nullable().optional().meta({
      example: 'Pass university entrance exam',
      description: 'Learning goal',
    }),
    gradeIds: z
      .array(z.string())
      .optional()
      .meta({
        example: ['clxxxxxx'],
        description: 'List of grade IDs the student wants to study',
      }),
    subjectIds: z
      .array(z.string())
      .optional()
      .meta({
        example: ['clxxxxxx'],
        description: 'List of subject IDs the student is interested in',
      }),
  })
  .meta({ id: 'UpdateStudentProfileDto' });

export class UpdateStudentProfileDto extends createZodDto(
  UpdateStudentProfileSchema,
) {}
