import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Lesson } from '../../domain/entities/lesson.entity';
import { ILessonRepository } from '../../domain/repositories/lesson.repository.interface';
import { LessonMapper } from '../mapper/lesson.mapper';
import { LessonDelegate } from './lesson.repository.type';

@Injectable()
export class PrismaLessonRepository implements ILessonRepository {
  private readonly mapper = new LessonMapper();

  constructor(private readonly prisma: PrismaService) {}

  private get lessonDelegate(): LessonDelegate {
    return this.prisma.lesson as unknown as LessonDelegate;
  }

  async create(lesson: Lesson): Promise<Lesson> {
    const data = this.mapper.toPersistence(lesson);
    const saved = await this.lessonDelegate.create({ data });
    return this.mapper.toDomain(saved);
  }

  async findById(id: string): Promise<Lesson | null> {
    const record = await this.lessonDelegate.findUnique({ where: { id } });
    if (!record) return null;
    return this.mapper.toDomain(record);
  }
}
