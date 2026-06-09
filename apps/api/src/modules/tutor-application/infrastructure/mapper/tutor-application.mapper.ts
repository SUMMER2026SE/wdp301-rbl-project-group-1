import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { TutorApplication } from '../../domain/entities/tutor-application.entity';
import {
  PrismaTutorApplicationRecord,
  TutorApplicationWriteData,
} from '../repositories/tutor-application.type';

export class TutorApplicationMapper implements IMapper<
  TutorApplication,
  PrismaTutorApplicationRecord | TutorApplicationWriteData
> {
  toDomain(record: PrismaTutorApplicationRecord): TutorApplication {
    const subjects = record.subjects ?? [];
    const grades = record.grades ?? [];

    return TutorApplication.create(record.id, {
      userId: record.userId,
      email: record.email,
      bio: record.bio ?? undefined,
      specialization: record.specialization,
      subjects,
      grades,
      // Derive IDs from the loaded relations so approve handler can use them
      subjectIds: subjects.map((s) => s.id),
      gradeIds: grades.map((g) => g.id),
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
