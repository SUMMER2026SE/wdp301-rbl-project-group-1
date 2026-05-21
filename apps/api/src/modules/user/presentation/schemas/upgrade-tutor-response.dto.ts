import { ApiProperty } from '@nestjs/swagger';

export class UpgradeTutorResultDto {
  @ApiProperty({
    example: true,
    description: 'Indicates whether the upgrade was successful',
  })
  success: boolean;
}
