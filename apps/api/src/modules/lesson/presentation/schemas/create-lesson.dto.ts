import { createZodDto } from 'nestjs-zod';
import { LessonStatus } from 'src/shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

const ScheduleStatusEnum = z.enum(LessonStatus);

export const CreateLessonSchema = z
  .object({
    courseId: z.string().min(1).meta({ example: 'clhg12345000008l4f1h5g6i7' }),
    title: z.string().min(1).meta({ example: 'Buổi học 1' }),
    content: z.string().optional().meta({ example: 'Nội dung buổi học' }),
    meetingUrl: z
      .string()
      .optional()
      .meta({ example: 'https://meet.example/abc' }),
    videoUrl: z
      .string()
      .optional()
      .meta({ example: 'https://video.example/abc' }),
    startTime: z
      .string()
      .datetime()
      .meta({ example: '2026-05-08T10:00:00.000Z' }),
    endTime: z
      .string()
      .datetime()
      .meta({ example: '2026-05-08T11:00:00.000Z' }),
    orderIndex: z.number().meta({ example: 1 }),
    status: ScheduleStatusEnum.meta({ example: 'SCHEDULED' }),
  })
  .meta({ id: 'CreateLessonDto' });

export class CreateLessonDto extends createZodDto(CreateLessonSchema) {}
