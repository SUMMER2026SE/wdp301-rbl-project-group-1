import { createZodDto } from 'nestjs-zod';
import { z as zod } from 'zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { BaseQuerySchema } from '../../../../shared/presentation/schemas/base-query.dto';
import {
  BookingStatus,
  TutoringMode,
} from '../../../../shared/domain/enums/enums';

export const GetBookingsQuerySchema = BaseQuerySchema.extend({
  status: z.nativeEnum(BookingStatus).optional().meta({
    description: 'Filter by booking status',
    example: BookingStatus.PENDING,
  }),
  mode: z.nativeEnum(TutoringMode).optional().meta({
    description: 'Filter by tutoring mode',
    example: TutoringMode.ONLINE,
  }),
}).meta({ id: 'GetBookingsQueryDto' });

export type GetBookingsQueryParams = zod.infer<typeof GetBookingsQuerySchema>;

export class GetBookingsQueryDto extends createZodDto(GetBookingsQuerySchema) {}
