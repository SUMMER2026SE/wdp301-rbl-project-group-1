import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Grade } from '../../domain/entities/grade.entity';
import { IGradeRepository } from '../../domain/repositories/grade.repository.interface';
import { GradeMapper } from '../mapper/grade.mapper';
import { GradeDelegate } from './grade.repository.type';

@Injectable()
export class PrismaGradeRepository implements IGradeRepository {
  private gradeDelegate: GradeDelegate;

  constructor(private readonly prisma: PrismaService) {
    this.gradeDelegate = this.prisma.grade;
  }

  async create(grade: Grade): Promise<Grade> {
    const data = GradeMapper.toPersistence(grade);

    const savedGrade = await this.gradeDelegate.create({
      data,
    });

    return GradeMapper.toDomain(savedGrade);
  }

  async findAll(): Promise<Grade[]> {
    const grades = await this.gradeDelegate.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    return grades.map((grade) => GradeMapper.toDomain(grade));
  }
}
