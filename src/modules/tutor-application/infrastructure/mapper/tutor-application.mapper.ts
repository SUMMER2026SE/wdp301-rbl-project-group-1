import { TutorApplication } from '../../domain/entities/tutor-application.entity';
import {
  PrismaTutorApplicationGradeRecord,
  PrismaTutorApplicationRecord,
  PrismaTutorApplicationSubjectRecord,
  TutorApplicationWriteData,
} from '../repositories/tutor-application.type';

export class TutorApplicationMapper {
  toDomain(record: PrismaTutorApplicationRecord): TutorApplication {
    return TutorApplication.create(record.id, {
      userId: record.userId,
      email: record.email,
      bio: record.bio ?? undefined,
      specialization: record.specialization,
      subjects: record.subjects?.map(
        (s: PrismaTutorApplicationSubjectRecord) => s.subject,
      ),
      grades: record.grades?.map(
        (g: PrismaTutorApplicationGradeRecord) => g.grade,
      ),
      experience: record.experience ?? undefined,
      education: record.education ?? undefined,
      pricePerHour: record.pricePerHour ?? undefined,
      avatarUrl: record.avatarUrl ?? undefined,
      files: record.files ?? undefined,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  toPersistence(application: TutorApplication): TutorApplicationWriteData {
    const data: TutorApplicationWriteData = {
      ...(application.id && { id: application.id }),
      userId: application.userId ?? null,
      email: application.email,
      bio: application.bio ?? null,
      specialization: application.specialization,
      experience: application.experience ?? null,
      education: application.education ?? null,
      pricePerHour: application.pricePerHour ?? null,
      avatarUrl: application.avatarUrl ?? null,
      files: application.files ?? [],
      status: application.status,
    };
    return data;
  }
}
