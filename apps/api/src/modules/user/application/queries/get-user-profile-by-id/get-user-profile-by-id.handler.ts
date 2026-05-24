import { NotFoundException } from '@nestjs/common';
import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRole as PrismaUserRole } from '../../../../../../generated/prisma/client';
import { IQuery } from '../../../../../shared/application/interfaces/use-case.interface';
import { Gender, UserRole } from '../../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { TutorViewedDomainEvent } from '../../../domain/events/tutor-viewed.domain-event';
import { GetUserProfileByIdQuery } from './get-user-profile-by-id.query';
import { GetUserProfileByIdResult } from './get-user-profile-by-id.result';

@QueryHandler(GetUserProfileByIdQuery)
export class GetUserProfileByIdQueryHandler
  implements
    IQueryHandler<GetUserProfileByIdQuery>,
    IQuery<GetUserProfileByIdQuery, GetUserProfileByIdResult>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(
    query: GetUserProfileByIdQuery,
  ): Promise<GetUserProfileByIdResult> {
    const user = await this.prisma.user.findUnique({
      where: { id: query.id },
      include: {
        profile: true,
        tutor: true,
        student: {
          include: {
            subjects: { include: { subject: true } },
            grades: { include: { grade: true } },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (
      user.role === PrismaUserRole.TUTOR &&
      query.viewerId &&
      query.viewerId !== user.id
    ) {
      this.eventBus.publish(
        new TutorViewedDomainEvent(query.viewerId, user.id),
      );
    }

    return {
      id: user.id,
      role: user.role as unknown as UserRole,
      createdAt: user.createdAt,
      profile: user.profile
        ? {
            nickname: user.profile.nickname,
            avatarUrl: user.profile.avatarUrl,
            dateOfBirth: user.profile.dateOfBirth.toISOString().slice(0, 10),
            gender: user.profile.gender as unknown as Gender | null,
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
    };
  }
}
