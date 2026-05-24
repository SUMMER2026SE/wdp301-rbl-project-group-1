import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { LessonAttendance } from '../../domain/entities/lesson-attendance.entity';
import { ILessonAttendanceRepository } from '../../domain/repositories/lesson-attendance.repository.interface';
import { LessonAttendanceMapper } from '../mapper/lesson-attendance.mapper';
import { LessonAttendanceDelegate } from './lesson-attendance.repository.type';

@Injectable()
export class PrismaLessonAttendanceRepository implements ILessonAttendanceRepository {
  private readonly mapper = new LessonAttendanceMapper();

  constructor(private readonly prisma: PrismaService) {}

  private get delegate(): LessonAttendanceDelegate {
    return this.prisma.lessonAttendance as unknown as LessonAttendanceDelegate;
  }

  async upsert(attendance: LessonAttendance): Promise<LessonAttendance> {
    const data = this.mapper.toPersistence(attendance);
    const record = await this.delegate.upsert({
      where: {
        lessonId_studentId: {
          lessonId: data.lessonId,
          studentId: data.studentId,
        },
      },
      create: {
        ...data,
        id: attendance.id,
      },
      update: {
        status: data.status,
        note: data.note,
      },
    });
    return this.mapper.toDomain(record);
  }

  async upsertMany(
    attendances: LessonAttendance[],
  ): Promise<LessonAttendance[]> {
    const results: LessonAttendance[] = [];
    for (const attendance of attendances) {
      results.push(await this.upsert(attendance));
    }
    return results;
  }

  async findByLessonId(lessonId: string): Promise<LessonAttendance[]> {
    const records = await this.delegate.findMany({
      where: { lessonId },
      orderBy: { markedAt: 'desc' },
    });
    return records.map((r) => this.mapper.toDomain(r));
  }

  async findByLessonAndStudent(
    lessonId: string,
    studentId: string,
  ): Promise<LessonAttendance | null> {
    const record = await this.delegate.findUnique({
      where: {
        lessonId_studentId: {
          lessonId,
          studentId,
        },
      },
    });
    if (!record) return null;
    return this.mapper.toDomain(record);
  }
}
