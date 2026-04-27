import { ApiProperty } from '@nestjs/swagger';

export class SubjectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  createdAt: Date;
}
