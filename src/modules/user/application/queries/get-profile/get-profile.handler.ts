import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRole as PrismaUserRole } from '../../../../../../generated/prisma/client';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { Gender, UserRole } from '../../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { GetProfileQuery } from './get-profile.query';
import { GetProfileResult } from './get-profile.result';

@QueryHandler(GetProfileQuery)
export class GetProfileQueryHandler
  implements
    IQueryHandler<GetProfileQuery>,
    IQuery<GetProfileQuery, GetProfileResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetProfileQuery): Promise<GetProfileResult> {
    const user = await this.prisma.user.findUnique({
      where: { id: query.userId },
      include: {
        profile: true,
        tutor: true,
        student: {
          include: {
            subjects: { include: { subject: true } },
            grades: { include: { grade: true } },
          },
        },
        parent: true,
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
      profile: user.profile
        ? {
            nickname: user.profile.nickname,
            avatarUrl: user.profile.avatarUrl,
            phone: user.profile.phone,
            dateOfBirth: user.profile.dateOfBirth.toISOString().slice(0, 10),
            gender: user.profile.gender as unknown as Gender | null,
            address: user.profile.address,
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
        user.role === PrismaUserRole.STUDENT && user.student
          ? {
              school: user.student.school,
              learningGoal: user.student.learningGoal,
              subjects: user.student.subjects.map((ss) => ({
                id: ss.subject.id,
                name: ss.subject.name,
                slug: ss.subject.slug,
              })),
              grades: user.student.grades.map((sg) => ({
                id: sg.grade.id,
                name: sg.grade.name,
                slug: sg.grade.slug,
                order: sg.grade.order,
              })),
            }
          : null,
      parent:
        user.role === PrismaUserRole.PARENT && user.parent
          ? {
              phone: user.parent.phone,
              address: user.parent.address,
            }
          : null,
    };
  }
}
