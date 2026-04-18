import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from 'src/shared/domain/enums/enums';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'johndoe', description: 'Nickname' })
  nickname?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'Avatar URL',
  })
  avatarUrl?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  phone?: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Date of birth',
    type: String,
    format: 'date',
  })
  @ApiPropertyOptional({ example: '01/01/2000', description: 'Date of birth' })
  dateOfBirth?: Date;

  @ApiPropertyOptional({ example: 'MALE', description: 'Gender' })
  gender?: Gender;

  @ApiPropertyOptional({ example: '123 Main St', description: 'Address' })
  address?: string;
}
