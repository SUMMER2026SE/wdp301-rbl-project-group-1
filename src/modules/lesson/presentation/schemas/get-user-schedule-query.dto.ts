import { createZodDto } from 'nestjs-zod';
import { z as zod } from 'zod';

export const GetUserScheduleQuerySchema = zod
  .object({
    date: zod
      .string()
      .datetime()
      .describe('An ISO-8601 date string to find the schedule for its week.'),
  })
  .meta({
    id: 'GetUserScheduleQueryDto',
  });

export type GetUserScheduleQueryParams = zod.infer<
  typeof GetUserScheduleQuerySchema
>;

export class GetUserScheduleQueryDto extends createZodDto(
  GetUserScheduleQuerySchema,
) {}
