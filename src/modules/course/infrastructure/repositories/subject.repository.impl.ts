import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Subject } from '../../domain/entities/subject.entity';
import { ISubjectRepository } from '../../domain/repositories/subject.repository.interface';
import { SubjectMapper } from '../mapper/subject.mapper';
import { SubjectDelegate } from './subject.repository.type';

@Injectable()
export class PrismaSubjectRepository implements ISubjectRepository {
  private subjectDelegate: SubjectDelegate;

  constructor(private readonly prisma: PrismaService) {
    this.subjectDelegate = this.prisma.subject;
  }

  async create(subject: Subject): Promise<Subject> {
    const data = SubjectMapper.toPersistence(subject);

    const savedSubject = await this.subjectDelegate.create({
      data,
    });

    return SubjectMapper.toDomain(savedSubject);
  }

  async findAll(): Promise<Subject[]> {
    const subjects = await this.subjectDelegate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return subjects.map((subject) => SubjectMapper.toDomain(subject));
  }
}
