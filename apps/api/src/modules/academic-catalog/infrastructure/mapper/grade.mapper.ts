import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { Grade } from '../../domain/entities/grade.entity';
import {
  GradeWriteData,
  PrismaGradeRecord,
} from '../repositories/grade.repository.type';

export class GradeMapper implements IMapper<
  Grade,
  PrismaGradeRecord | GradeWriteData
> {
  toDomain(prismaGrade: PrismaGradeRecord): Grade {
    return Grade.create(prismaGrade.id, {
      name: prismaGrade.name,
      slug: prismaGrade.slug,
      order: prismaGrade.order,
      createdAt: prismaGrade.createdAt,
    });
  }

  toPersistence(grade: Grade): GradeWriteData {
    const data: GradeWriteData = {
      ...(grade.id && { id: grade.id }),
      name: grade.name,
      slug: grade.slug,
      order: grade.order,
      createdAt: grade.createdAt,
    };

    return data;
  }
}
