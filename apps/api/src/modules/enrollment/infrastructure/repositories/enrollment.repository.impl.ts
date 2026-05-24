import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Enrollment } from '../../domain/entities/enrollment.entity';
import { IEnrollmentRepository } from '../../domain/repositories/enrollment.repository.interface';
import { EnrollmentMapper } from '../mapper/enrollment.mapper';
import { EnrollmentDelegate } from './enrollment.repository.type';

@Injectable()
export class PrismaEnrollmentRepository implements IEnrollmentRepository {
  private readonly mapper = new EnrollmentMapper();

  constructor(private readonly prisma: PrismaService) {}

  private get enrollmentDelegate(): EnrollmentDelegate {
    return this.prisma.enrollment as unknown as EnrollmentDelegate;
  }

  async create(enrollment: Enrollment): Promise<Enrollment> {
    const data = this.mapper.toPersistence(enrollment);
    const saved = await this.enrollmentDelegate.create({ data });
    return this.mapper.toDomain(saved);
  }

  async findByStudentAndCourse(
    studentId: string,
    courseId: string,
  ): Promise<Enrollment | null> {
    const record = await this.enrollmentDelegate.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
    });
    if (!record) return null;
    return this.mapper.toDomain(record);
  }

  async findById(id: string): Promise<Enrollment | null> {
    const record = await this.enrollmentDelegate.findUnique({
      where: { id },
    });
    if (!record) return null;
    return this.mapper.toDomain(record);
  }

  async update(enrollment: Enrollment): Promise<Enrollment> {
    const data = this.mapper.toPersistence(enrollment);
    const updated = await this.enrollmentDelegate.update({
      where: { id: enrollment.id },
      data,
    });
    return this.mapper.toDomain(updated);
  }
}
