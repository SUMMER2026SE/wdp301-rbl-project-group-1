import { createZodDto } from 'nestjs-zod';
import { z as zod } from 'zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { BaseQuerySchema } from '../../../../shared/presentation/schemas/base-query.dto';
import {
  RequestStatus,
  TutoringMode,
} from '../../../../shared/domain/enums/enums';

export const GetTutorRequestsQuerySchema = BaseQuerySchema.extend({
  subjectId: z.string().optional().meta({
    description: 'Filter by subject ID',
    example: 'clxsubject00000123456789',
  }),
  mode: z.nativeEnum(TutoringMode).optional().meta({
    description: 'Filter by tutoring mode',
    example: TutoringMode.ONLINE,
  }),
  status: z.nativeEnum(RequestStatus).optional().meta({
    description: 'Filter by request status',
    example: RequestStatus.OPEN,
  }),
}).meta({ id: 'GetTutorRequestsQueryDto' });

export type GetTutorRequestsQueryParams = zod.infer<
  typeof GetTutorRequestsQuerySchema
>;

export class GetTutorRequestsQueryDto extends createZodDto(
  GetTutorRequestsQuerySchema,
) {}
