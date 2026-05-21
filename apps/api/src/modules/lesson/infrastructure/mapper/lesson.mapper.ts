import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { Lesson } from '../../domain/entities/lesson.entity';
import {
  LessonWriteData,
  PrismaLessonRecord,
} from '../repositories/lesson.repository.type';

export class LessonMapper implements IMapper<
  Lesson,
  PrismaLessonRecord | LessonWriteData
> {
  toDomain(record: PrismaLessonRecord): Lesson {
    return Lesson.create(record.id, {
      courseId: record.courseId,
      title: record.title,
      content: record.content,
      meetingUrl: record.meetingUrl,
      videoUrl: record.videoUrl,
      startTime: record.startTime,
      endTime: record.endTime,
      orderIndex: record.orderIndex,
      status: record.status,
      createdAt: record.createdAt,
    });
  }

  toPersistence(lesson: Lesson): LessonWriteData {
    const data: LessonWriteData = {
      ...(lesson.id && { id: lesson.id }),
      courseId: lesson.courseId,
      title: lesson.title,
      content: lesson.content ?? null,
      meetingUrl: lesson.meetingUrl ?? null,
      videoUrl: lesson.videoUrl ?? null,
      startTime: lesson.startTime,
      endTime: lesson.endTime ?? null,
      orderIndex: lesson.orderIndex,
      status: lesson.status,
    };
    return data;
  }
}
