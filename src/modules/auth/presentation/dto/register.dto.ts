import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  password!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.STUDENT,
    description: 'The role of the user',
  })
  role!: UserRole;

  @ApiProperty({
    example: 'johndoe',
    description: 'The nickname of the user',
  })
  nickname!: string;
}
