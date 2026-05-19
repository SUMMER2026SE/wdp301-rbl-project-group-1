import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { Subject } from '../../domain/entities/subject.entity';
import {
  PrismaSubjectRecord,
  SubjectWriteData,
} from '../repositories/subject.repository.type';

export class SubjectMapper implements IMapper<
  Subject,
  PrismaSubjectRecord | SubjectWriteData
> {
  toDomain(prismaSubject: PrismaSubjectRecord): Subject {
    return Subject.create(prismaSubject.id, {
      name: prismaSubject.name,
      slug: prismaSubject.slug,
      createdAt: prismaSubject.createdAt,
    });
  }

  toPersistence(subject: Subject): SubjectWriteData {
    const data: SubjectWriteData = {
      ...(subject.id && { id: subject.id }),
      name: subject.name,
      slug: subject.slug,
      createdAt: subject.createdAt,
    };

    return data;
  }
}
