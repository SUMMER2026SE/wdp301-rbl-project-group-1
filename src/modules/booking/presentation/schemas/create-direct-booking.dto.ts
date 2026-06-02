import { createZodDto } from 'nestjs-zod';
import { TutoringMode } from '../../../../shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

const TimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must use HH:mm format');

const ScheduleRuleSchema = z
  .object({
    dayOfWeek: z
      .number()
      .int()
      .min(0)
      .max(6)
      .meta({ example: 1, description: 'Day of week, where 0 is Sunday' }),
    startTime: TimeSchema.meta({
      example: '18:00',
      description: 'Start time in HH:mm format',
    }),
    endTime: TimeSchema.meta({
      example: '19:30',
      description: 'End time in HH:mm format',
    }),
  })
  .refine((rule) => rule.startTime < rule.endTime, {
    message: 'endTime must be after startTime',
    path: ['endTime'],
  });

export const CreateDirectBookingSchema = z
  .object({
    tutorId: z.string().meta({
      example: 'clxtutor00000123456789',
      description: 'ID of the tutor to book',
    }),
    subjectId: z.string().optional().meta({
      example: 'clxsubject00000123456789',
      description: 'Optional subject ID',
    }),
    mode: z.nativeEnum(TutoringMode).meta({
      example: TutoringMode.ONLINE,
      description: 'Tutoring mode: ONLINE or AT_HOME',
    }),
    message: z.string().max(2000).optional().meta({
      example: 'Tôi cần ôn tập căn bản Toán 10, ưu tiên buổi tối.',
      description: 'Optional message / learning goals',
    }),
    totalSessions: z.number().int().positive().min(1).meta({
      example: 10,
      description: 'Total number of sessions for the request',
    }),
    scheduleRules: z.array(ScheduleRuleSchema).min(1).meta({
      description: 'Weekly recurring schedule slots selected by student',
    }),
  })
  .meta({ id: 'CreateDirectBookingDto' });

export class CreateDirectBookingDto extends createZodDto(
  CreateDirectBookingSchema,
) {}
