import { ApiProperty } from '@nestjs/swagger';

export class GradeResponseDto {
  @ApiProperty({
    example: 'cuid...',
    description: 'The unique identifier of the grade',
  })
  id: string;

  @ApiProperty({
    example: 'Lớp 11',
    description: 'The name of the grade',
  })
  name: string;

  @ApiProperty({
    example: 'lop-11',
    description: 'The slug of the grade',
  })
  slug: string;

  @ApiProperty({
    example: 11,
    description: 'The sorting order of the grade',
  })
  order: number;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  createdAt: Date;
}
