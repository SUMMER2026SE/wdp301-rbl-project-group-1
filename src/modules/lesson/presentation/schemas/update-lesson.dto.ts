import { createZodDto } from 'nestjs-zod';
import { LessonStatus } from '../../../../shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

const LessonStatusEnum = z.enum(LessonStatus);

export const UpdateLessonSchema = z
  .object({
    title: z.string().min(1).optional().meta({ example: 'Buổi học 2' }),
    content: z
      .string()
      .nullable()
      .optional()
      .meta({ example: 'Nội dung cập nhật' }),
    meetingUrl: z
      .string()
      .nullable()
      .optional()
      .meta({ example: 'https://meet.example/xyz' }),
    videoUrl: z
      .string()
      .nullable()
      .optional()
      .meta({ example: 'https://video.example/xyz' }),
    startTime: z
      .string()
      .datetime()
      .optional()
      .meta({ example: '2026-05-10T10:00:00.000Z' }),
    endTime: z
      .string()
      .datetime()
      .nullable()
      .optional()
      .meta({ example: '2026-05-10T11:00:00.000Z' }),
    orderIndex: z.number().optional().meta({ example: 2 }),
    status: LessonStatusEnum.optional().meta({ example: 'ONGOING' }),
  })
  .meta({ id: 'UpdateLessonDto' });

export class UpdateLessonDto extends createZodDto(UpdateLessonSchema) {}
