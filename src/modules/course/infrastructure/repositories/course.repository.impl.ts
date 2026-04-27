import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Course } from '../../domain/entities/course.entity';
import { ICourseRepository } from '../../domain/repositories/course.repository.interface';
import { CourseMapper } from '../mapper/course.mapper';
import { CourseDelegate } from './course.repository.type';

@Injectable()
export class PrismaCourseRepository implements ICourseRepository {
  private readonly mapper = new CourseMapper();

  constructor(private readonly prisma: PrismaService) {}

  private get courseDelegate(): CourseDelegate {
    return this.prisma.course as unknown as CourseDelegate;
  }

  async create(course: Course): Promise<Course> {
    const data = this.mapper.toPersistence(course);

    const savedCourse = await this.courseDelegate.create({ data });

    return this.mapper.toDomain(savedCourse);
  }

  async findById(id: string): Promise<Course | null> {
    const coursePrisma = await this.courseDelegate.findUnique({
      where: { id },
    });

    if (!coursePrisma) {
      return null;
    }

    return this.mapper.toDomain(coursePrisma);
  }

  async findAll(): Promise<Course[]> {
    const coursesPrisma = await this.courseDelegate.findMany();
    return coursesPrisma.map((course) => this.mapper.toDomain(course));
  }
}
