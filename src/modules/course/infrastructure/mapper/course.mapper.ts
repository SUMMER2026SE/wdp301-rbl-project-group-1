import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { Course } from '../../domain/entities/course.entity';
import { CourseLevel } from '../../domain/value-objects/course-level';
import {
  CourseWriteData,
  PrismaCourseRecord,
} from '../repositories/course.repository.type';

export class CourseMapper implements IMapper<
  Course,
  PrismaCourseRecord | CourseWriteData
> {
  toDomain(record: PrismaCourseRecord): Course {
    return Course.create(record.id, {
      tutorId: record.tutorId,
      title: record.title,
      description: record.description,
      price: record.price,
      subjectId: record.subjectId,
      gradeId: record.gradeId,
      level: CourseLevel.create(record.level),
      status: record.status,
      createdAt: record.createdAt,
    });
  }

  toPersistence(course: Course): CourseWriteData {
    const data: CourseWriteData = {
      ...(course.id && { id: course.id }),
      tutorId: course.tutorId,
      title: course.title,
      description: course.description ?? null,
      price: course.price ?? null,
      subjectId: course.subjectId,
      gradeId: course.gradeId,
      level: course.level.getValue(),
      status: course.status,
    };
    return data;
  }
}
