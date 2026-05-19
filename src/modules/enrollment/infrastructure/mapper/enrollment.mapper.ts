import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { Enrollment } from '../../domain/entities/enrollment.entity';
import {
  EnrollmentWriteData,
  PrismaEnrollmentRecord,
} from '../repositories/enrollment.repository.type';

export class EnrollmentMapper implements IMapper<
  Enrollment,
  PrismaEnrollmentRecord | EnrollmentWriteData
> {
  toDomain(record: PrismaEnrollmentRecord): Enrollment {
    return Enrollment.create(record.id, {
      studentId: record.studentId,
      courseId: record.courseId,
      status: record.status,
      enrolledAt: record.enrolledAt,
    });
  }

  toPersistence(enrollment: Enrollment): EnrollmentWriteData {
    return {
      ...(enrollment.id && { id: enrollment.id }),
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      status: enrollment.status,
    };
  }
}
