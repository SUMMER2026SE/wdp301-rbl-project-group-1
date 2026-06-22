import { ApiProperty } from '@nestjs/swagger';

export class BanUserResultDto {
  @ApiProperty({ example: 'cld_abc123', description: 'ID of the banned user' })
  userId: string;

  @ApiProperty({
    example: 'User has been banned successfully',
    description: 'Result message',
  })
  message: string;
}

export class UnbanUserResultDto {
  @ApiProperty({
    example: 'cld_abc123',
    description: 'ID of the unbanned user',
  })
  userId: string;

  @ApiProperty({
    example: 'User has been unbanned successfully',
    description: 'Result message',
  })
  message: string;
}
