import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

const TimeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must use HH:mm format');

export const ScheduleAvailabilitySlotSchema = z
  .object({
    dayOfWeek: z
      .number()
      .int()
      .min(0)
      .max(6)
      .meta({ example: 1, description: 'Day of week, where 0 is Sunday' }),
    startTime: TimeSchema.meta({
      example: '09:00',
      description: 'Start time in HH:mm format',
    }),
    endTime: TimeSchema.meta({
      example: '17:00',
      description: 'End time in HH:mm format',
    }),
  })
  .refine((slot) => slot.startTime < slot.endTime, {
    message: 'endTime must be after startTime',
    path: ['endTime'],
  });

export const UpdateScheduleAvailabilitySchema = z
  .object({
    availability: z
      .array(ScheduleAvailabilitySlotSchema)
      .meta({ description: 'Weekly availability slots' }),
  })
  .meta({ id: 'UpdateScheduleAvailabilityDto' });

export class UpdateScheduleAvailabilityDto extends createZodDto(
  UpdateScheduleAvailabilitySchema,
) {}

export const ScheduleAvailabilitySlotResponseSchema = z
  .object({
    id: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    dayOfWeek: z.number().int().min(0).max(6).meta({ example: 1 }),
    startTime: TimeSchema.meta({ example: '09:00' }),
    endTime: TimeSchema.meta({ example: '17:00' }),
    createdAt: z
      .string()
      .datetime()
      .meta({ example: '2025-01-01T00:00:00.000Z' }),
    updatedAt: z
      .string()
      .datetime()
      .meta({ example: '2025-01-01T00:00:00.000Z' }),
  })
  .meta({ id: 'ScheduleAvailabilitySlotResponseDto' });

export const ScheduleAvailabilityResponseSchema = z
  .object({
    userId: z.string().meta({ example: 'cm9x8v7w60000abc123def456' }),
    availability: z.array(ScheduleAvailabilitySlotResponseSchema),
  })
  .meta({ id: 'ScheduleAvailabilityResponseDto' });

export class ScheduleAvailabilityResponseDto extends createZodDto(
  ScheduleAvailabilityResponseSchema,
) {}
