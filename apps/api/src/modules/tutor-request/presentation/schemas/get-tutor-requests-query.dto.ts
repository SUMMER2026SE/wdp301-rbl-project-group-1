import { createZodDto } from 'nestjs-zod';
import { z as zod } from 'zod';
import {
  RequestStatus,
  TutoringMode,
} from '../../../../shared/domain/enums/enums';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';
import { BaseQuerySchema } from '../../../../shared/presentation/schemas/base-query.dto';

export const GetTutorRequestsQuerySchema = BaseQuerySchema.extend({
  studentId: z.string().optional().meta({
    description: 'Filter by student ID',
    example: 'clxstudent0000123456789',
  }),
  subjectIds: z
    .preprocess(
      (v) => (v === undefined ? undefined : Array.isArray(v) ? v : [v]),
      z.array(z.string()).optional(),
    )
    .meta({
      description: 'Filter by one or more subject IDs',
      example: ['clxsubject00000123456789'],
    }),
  gradeIds: z
    .preprocess(
      (v) => (v === undefined ? undefined : Array.isArray(v) ? v : [v]),
      z.array(z.string()).optional(),
    )
    .meta({
      description: 'Filter by one or more grade IDs',
      example: ['clxgrade00000123456789'],
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
