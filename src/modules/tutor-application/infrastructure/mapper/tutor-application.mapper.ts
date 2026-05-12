import { TutorApplication } from '../../domain/entities/tutor-application.entity';
import {
  PrismaTutorApplicationRecord,
  TutorApplicationWriteData,
} from '../repositories/tutor-application.type';

export class TutorApplicationMapper {
  toDomain(record: PrismaTutorApplicationRecord): TutorApplication {
    return TutorApplication.create(record.id, {
      userId: record.userId,
      email: record.email,
      bio: record.bio ?? undefined,
      specialization: record.specialization,
      experience: record.experience ?? undefined,
      education: record.education ?? undefined,
      pricePerHour: record.pricePerHour ?? undefined,
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
      status: application.status,
    };
    return data;
  }
}
