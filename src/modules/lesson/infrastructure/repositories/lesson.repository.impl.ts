import { Injectable } from '@nestjs/common';
import {
  createQueryResult,
  QueryResult,
} from '../../../../shared/domain/common/query';
import {
  AttendanceStatus,
  LessonStatus,
} from '../../../../shared/domain/enums/enums';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Lesson } from '../../domain/entities/lesson.entity';
import {
  ILessonRepository,
  LessonPaginatedParams,
  LessonWithDetails,
  StudentScheduleLesson,
  StudentScheduleParams,
  TutorScheduleLesson,
  TutorScheduleParams,
} from '../../domain/repositories/lesson.repository.interface';
import { LessonMapper } from '../mapper/lesson.mapper';
import { LessonDelegate } from './lesson.repository.type';

@Injectable()
export class PrismaLessonRepository implements ILessonRepository {
  private readonly mapper = new LessonMapper();

  constructor(private readonly prisma: PrismaService) {}

  private get lessonDelegate(): LessonDelegate {
    return this.prisma.lesson as unknown as LessonDelegate;
  }

  async create(lesson: Lesson): Promise<Lesson> {
    const data = this.mapper.toPersistence(lesson);
    const saved = await this.lessonDelegate.create({ data });
    return this.mapper.toDomain(saved);
  }

  async findById(id: string): Promise<Lesson | null> {
    const record = await this.lessonDelegate.findUnique({ where: { id } });
    if (!record) return null;
    return this.mapper.toDomain(record);
  }

  async findByCourseId(
    params: LessonPaginatedParams,
  ): Promise<QueryResult<Lesson>> {
    const where: Record<string, unknown> = { courseId: params.courseId };

    if (params.search) {
      where.title = { contains: params.search, mode: 'insensitive' };
    }

    const orderBy = params.sortBy
      ? { [params.sortBy]: params.sortOrder ?? 'asc' }
      : { orderIndex: 'asc' as const };

    const [total, records] = await Promise.all([
      this.lessonDelegate.count({ where }),
      this.lessonDelegate.findMany({
        where,
        orderBy,
        skip: params.skip,
        take: params.limit,
      }),
    ]);

    const lessons = records.map((r) => this.mapper.toDomain(r));
    return createQueryResult(lessons, total, params);
  }

  async findStudentSchedule(
    params: StudentScheduleParams,
  ): Promise<StudentScheduleLesson[]> {
    const { studentId, startDate, endDate } = params;

    const records = await this.prisma.lesson.findMany({
      where: {
        startTime: { gte: startDate, lte: endDate },
        course: {
          enrollments: {
            some: { studentId, status: 'ACTIVE' },
          },
        },
      },
      orderBy: { startTime: 'asc' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            tutor: {
              include: {
                user: {
                  select: {
                    profile: {
                      select: { nickname: true, avatarUrl: true },
                    },
                  },
                },
              },
            },
          },
        },
        attendances: {
          where: { studentId },
          take: 1,
          select: { status: true, note: true },
        },
      },
    });

    return records.map((r) => ({
      id: r.id,
      courseId: r.courseId,
      courseTitle: r.course.title,
      tutorNickname: r.course.tutor.user.profile?.nickname ?? null,
      tutorAvatarUrl: r.course.tutor.user.profile?.avatarUrl ?? null,
      title: r.title,
      meetingUrl: r.meetingUrl,
      videoUrl: r.videoUrl,
      startTime: r.startTime,
      endTime: r.endTime,
      status: r.status as unknown as LessonStatus,
      attendance: r.attendances[0]
        ? {
            status: r.attendances[0].status as unknown as AttendanceStatus,
            note: r.attendances[0].note,
          }
        : null,
    }));
  }

  async findTutorSchedule(
    params: TutorScheduleParams,
  ): Promise<TutorScheduleLesson[]> {
    const { tutorId, startDate, endDate } = params;

    const records = await this.prisma.lesson.findMany({
      where: {
        startTime: { gte: startDate, lte: endDate },
        course: { tutorId },
      },
      orderBy: { startTime: 'asc' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            _count: {
              select: {
                enrollments: { where: { status: 'ACTIVE' } },
              },
            },
          },
        },
        _count: {
          select: { attendances: true },
        },
      },
    });

    return records.map((r) => ({
      id: r.id,
      courseId: r.courseId,
      courseTitle: r.course.title,
      title: r.title,
      meetingUrl: r.meetingUrl,
      videoUrl: r.videoUrl,
      startTime: r.startTime,
      endTime: r.endTime,
      status: r.status as unknown as LessonStatus,
      enrolledStudentCount: r.course._count.enrollments,
      attendanceMarked: r._count.attendances > 0,
    }));
  }

  async findByIdWithDetails(id: string): Promise<LessonWithDetails | null> {
    const record = await this.lessonDelegate.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            subject: true,
            grade: true,
            tutor: { include: { user: { include: { profile: true } } } },
          },
        },
      },
    });
    if (!record) return null;

    const { course } = record;
    const { tutor } = course;

    return {
      lesson: this.mapper.toDomain(record),
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        subjectName: course.subject?.name ?? null,
        gradeName: course.grade?.name ?? null,
        level: course.level,
        status: course.status,
      },
      tutor: {
        id: tutor.user.id,
        email: tutor.user.email,
        nickname: tutor.user.profile?.nickname ?? null,
        avatarUrl: tutor.user.profile?.avatarUrl ?? null,
      },
    };
  }

  async update(lesson: Lesson): Promise<Lesson> {
    const data = this.mapper.toPersistence(lesson);
    const updated = await this.lessonDelegate.update({
      where: { id: lesson.id },
      data,
    });
    return this.mapper.toDomain(updated);
  }
}
