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

export const CreateTutorRequestSchema = z
  .object({
    subjectId: z.string().optional().meta({
      example: 'clxsubject00000123456789',
      description: 'Optional subject ID for the request',
    }),
    title: z.string().min(1).max(200).meta({
      example: 'Need a math tutor for grade 10 algebra',
      description: 'Short request title',
    }),
    description: z.string().min(1).meta({
      example: 'I need help twice a week with algebra and exam preparation.',
      description: 'Detailed tutoring need',
    }),
    mode: z.nativeEnum(TutoringMode).meta({
      example: TutoringMode.ONLINE,
      description: 'Preferred tutoring mode',
    }),
    budget: z.number().positive().optional().meta({
      example: 250000,
      description: 'Optional budget for the request',
    }),
    scheduleRules: z.array(ScheduleRuleSchema).optional().meta({
      description: 'Optional recurring schedule rules',
    }),
  })
  .meta({ id: 'CreateTutorRequestDto' });

export class CreateTutorRequestDto extends createZodDto(
  CreateTutorRequestSchema,
) {}

export const SetTutorBidSchema = z
  .object({
    proposedPrice: z.number().positive().optional().meta({
      example: 220000,
      description: 'Tutor proposed price',
    }),
    message: z.string().min(1).max(2000).optional().meta({
      example: 'I can help with algebra and prepare a weekly study plan.',
      description: 'Proposal message from the tutor',
    }),
  })
  .refine(
    (bid) => bid.proposedPrice !== undefined || bid.message !== undefined,
    {
      message: 'At least one of proposedPrice or message is required',
    },
  )
  .meta({ id: 'SetTutorBidDto' });

export class SetTutorBidDto extends createZodDto(SetTutorBidSchema) {}
