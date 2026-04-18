import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../../shared/domain/enums/enums';
import { User } from '../../domain/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STUDENT })
  role!: UserRole;

  @ApiProperty({ example: 'JohnDoe', nullable: true })
  nickname!: string | null;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ example: false })
  isVerified!: boolean;

  @ApiProperty({ example: false })
  isFlag!: boolean;

  @ApiProperty({ example: 0 })
  reportCount!: number;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt!: Date;

  static fromDomain(
    user: User,
    nickname: string | null = null,
  ): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.role = user.role;
    dto.nickname = nickname;
    dto.isActive = user.isActive;
    dto.isVerified = user.isVerified;
    dto.isFlag = user.isFlag;
    dto.reportCount = user.reportCount;
    dto.createdAt = user.createdAt;
    return dto;
  }
}

export class UsersListResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Success' })
  message!: string;

  @ApiProperty({ type: () => UserResponseDto, isArray: true, nullable: true })
  data!: UserResponseDto[] | null;
}
