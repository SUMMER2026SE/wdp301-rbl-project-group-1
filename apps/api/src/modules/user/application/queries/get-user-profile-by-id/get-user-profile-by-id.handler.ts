import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRole as PrismaUserRole } from '../../../../../../generated/prisma/client';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { Gender, UserRole } from '../../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { GetUserProfileByIdQuery } from './get-user-profile-by-id.query';
import { GetUserProfileByIdResult } from './get-user-profile-by-id.result';

@QueryHandler(GetUserProfileByIdQuery)
export class GetUserProfileByIdHandler
  implements
    IQueryHandler<GetUserProfileByIdQuery>,
    IQuery<GetUserProfileByIdQuery, GetUserProfileByIdResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: GetUserProfileByIdQuery,
  ): Promise<GetUserProfileByIdResult> {
    const user = await this.prisma.user.findUnique({
      where: { id: query.id },
      include: {
        tutor: true,
        subjects: true,
        grades: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role as unknown as UserRole,
      isActive: user.isActive,
      isVerified: user.isVerified,
      isFlag: user.isFlag,
      reportCount: user.reportCount,
      createdAt: user.createdAt,
      profile: user.nickname
        ? {
            nickname: user.nickname,
            avatarUrl: user.avatarUrl,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth
              ? user.dateOfBirth.toISOString().slice(0, 10)
              : null,
            gender: user.gender as unknown as Gender | null,
            address: user.address,
          }
        : null,
      tutor:
        user.role === PrismaUserRole.TUTOR && user.tutor
          ? {
              bio: user.tutor.bio,
              specialization: user.tutor.specialization,
              experience: user.tutor.experience,
              education: user.tutor.education,
              pricePerHour: user.tutor.pricePerHour,
              rating: user.tutor.rating,
              reviewCount: user.tutor.reviewCount,
              studentCount: user.tutor.studentCount,
            }
          : null,
      student:
        user.role === PrismaUserRole.STUDENT
          ? {
              school: user.school,
              learningGoal: user.learningGoal,
              subjects: user.subjects.map((s) => ({
                id: s.id,
                name: s.name,
                slug: s.slug,
              })),
              grades: user.grades.map((g) => ({
                id: g.id,
                name: g.name,
                slug: g.slug,
                order: g.order,
              })),
            }
          : null,
      parent: null,
    };
  }
}
