import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const CreateCourseResultSchema = z
  .object({
    id: z.string().meta({
      description: 'The ID of the newly created course',
      example: 'clhg12345000008l4f1h5g6i7',
    }),
  })
  .meta({ id: 'CreateCourseResultDto' });

export class CreateCourseResultDto extends createZodDto(
  CreateCourseResultSchema,
) {}

export class CourseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tutorId: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description: string | null;

  @ApiPropertyOptional()
  price: number | null;

  @ApiProperty()
  subjectId: string;

  @ApiProperty()
  gradeId: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;
}
