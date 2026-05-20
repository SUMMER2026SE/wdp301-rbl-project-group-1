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
      include: { subject: true, grade: true },
    });
    if (!c) return null;
    return {
      course: this.mapper.toDomain(c),
      subject: { id: c.subjectId, name: c.subject?.name ?? null },
      grade: { id: c.gradeId, name: c.grade?.name ?? null },
    };
  }

  async findAll(
    params: CoursePaginatedParams,
  ): Promise<QueryResult<CourseWithMeta>> {
    const where: Record<string, unknown> = {};

    if (params.search) {
      where.title = { contains: params.search, mode: 'insensitive' };
    }
    if (params.gradeId) {
      where.gradeId = params.gradeId;
    }
    if (params.subjectId) {
      where.subjectId = params.subjectId;
    }

    if (params.tutorId) {
      where.tutorId = params.tutorId;
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
        include: { subject: true, grade: true },
      }),
    ]);

    const courses: CourseWithMeta[] = coursesPrisma.map((c) => ({
      course: this.mapper.toDomain(c),
      subject: { id: c.subjectId, name: c.subject?.name ?? null },
      grade: { id: c.gradeId, name: c.grade?.name ?? null },
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
      email: e.student.user.email,
      nickname: e.student.user.profile?.nickname ?? null,
      avatarUrl: e.student.user.profile?.avatarUrl ?? null,
      school: e.student.school ?? null,
      learningGoal: e.student.learningGoal ?? null,
      status: e.status,
      enrolledAt: e.enrolledAt,
    }));
  }
}
