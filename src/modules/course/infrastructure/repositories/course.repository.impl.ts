import { Injectable } from '@nestjs/common';
import {
  createQueryResult,
  QueryResult,
} from '../../../../shared/domain/common/query';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Course } from '../../domain/entities/course.entity';
import {
  CoursePaginatedParams,
  CourseWithMeta,
  ICourseRepository,
  JoinedStudent,
} from '../../domain/repositories/course.repository.interface';
import { CourseMapper } from '../mapper/course.mapper';
import { CourseDelegate, EnrollmentDelegate } from './course.repository.type';

@Injectable()
export class PrismaCourseRepository implements ICourseRepository {
  private readonly mapper = new CourseMapper();

  constructor(private readonly prisma: PrismaService) {}

  private get courseDelegate(): CourseDelegate {
    return this.prisma.course as unknown as CourseDelegate;
  }

  private get enrollmentDelegate(): EnrollmentDelegate {
    return this.prisma.enrollment as unknown as EnrollmentDelegate;
  }

  async create(course: Course): Promise<Course> {
    const data = this.mapper.toPersistence(course);
    const savedCourse = await this.courseDelegate.create({ data });
    return this.mapper.toDomain(savedCourse);
  }

  async findById(id: string): Promise<Course | null> {
    const coursePrisma = await this.courseDelegate.findUnique({
      where: { id },
    });
    if (!coursePrisma) return null;
    return this.mapper.toDomain(coursePrisma);
  }

  async findByIdWithMeta(id: string): Promise<CourseWithMeta | null> {
    const c = await this.courseDelegate.findUnique({
      where: { id },
      include: {
        subject: true,
        grade: true,
        tutor: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });
    if (!c) return null;
    return {
      course: this.mapper.toDomain(c),
      subject: { id: c.subjectId, name: c.subject?.name ?? null },
      grade: { id: c.gradeId, name: c.grade?.name ?? null },
      tutor: {
        id: c.tutorId,
        name: c.tutor?.user?.profile?.nickname ?? null,
        avatarUrl: c.tutor?.user?.profile?.avatarUrl ?? null,
      },
    };
  }

  async findAll(
    params: CoursePaginatedParams,
  ): Promise<QueryResult<CourseWithMeta>> {
    const where: Record<string, unknown> = {};

    if (params.search) {
      where.title = { contains: params.search, mode: 'insensitive' };
    }
    if (params.gradeIds && params.gradeIds.length > 0) {
      where.gradeId = { in: params.gradeIds };
    }
    if (params.subjectIds && params.subjectIds.length > 0) {
      where.subjectId = { in: params.subjectIds };
    }

    if (params.tutorId) {
      where.tutorId = params.tutorId;
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (params.minPrice !== undefined) priceFilter.gte = params.minPrice;
      if (params.maxPrice !== undefined) priceFilter.lte = params.maxPrice;
      where.price = priceFilter;
    }

    // If restrictStatus is true and no status specified, only show PUBLISHED courses
    if (params.restrictStatus && !params.status) {
      where.status = 'PUBLISHED';
    } else if (params.status) {
      where.status = params.status;
    }

    const orderBy = params.sortBy
      ? { [params.sortBy]: params.sortOrder ?? 'asc' }
      : { createdAt: 'desc' as const };

    const [total, coursesPrisma] = await Promise.all([
      this.courseDelegate.count({ where }),
      this.courseDelegate.findMany({
        where,
        orderBy,
        skip: params.skip,
        take: params.limit,
        include: {
          subject: true,
          grade: true,
          tutor: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
      }),
    ]);

    let enrolledCourseIds = new Set<string>();
    if (params.studentId) {
      const enrollments = await this.enrollmentDelegate.findMany({
        where: {
          studentId: params.studentId,
          courseId: { in: coursesPrisma.map((c) => c.id) },
          status: 'ACTIVE',
        },
        select: { courseId: true },
      });
      enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
    }

    const courses: CourseWithMeta[] = coursesPrisma.map((c) => ({
      course: this.mapper.toDomain(c),
      subject: { id: c.subjectId, name: c.subject?.name ?? null },
      grade: { id: c.gradeId, name: c.grade?.name ?? null },
      tutor: {
        id: c.tutorId,
        name: c.tutor?.user?.profile?.nickname ?? null,
        avatarUrl: c.tutor?.user?.profile?.avatarUrl ?? null,
      },
      isEnrolled: enrolledCourseIds.has(c.id),
    }));

    return createQueryResult(courses, total, params);
  }

  async update(course: Course): Promise<Course> {
    const data = this.mapper.toPersistence(course);
    const updatedCourse = await this.courseDelegate.update({
      where: { id: course.id },
      data,
    });
    return this.mapper.toDomain(updatedCourse);
  }

  async findJoinedStudents(courseId: string): Promise<JoinedStudent[]> {
    const enrollments = await this.enrollmentDelegate.findMany({
      where: { courseId },
      include: {
        student: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });

    return enrollments.map((e) => ({
      studentId: e.studentId,
      email: e.student!.user.email,
      nickname: e.student!.user.profile?.nickname ?? null,
      avatarUrl: e.student!.user.profile?.avatarUrl ?? null,
      school: e.student!.school ?? null,
      learningGoal: e.student!.learningGoal ?? null,
      status: e.status,
      enrolledAt: e.enrolledAt,
    }));
  }
}
