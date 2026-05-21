import { Injectable } from '@nestjs/common';
import { PrismaTransactionContext } from '../../../../shared/infrastructure/database/prisma/prisma-transaction.context';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Student } from '../../domain/entities/student.entity';
import { IStudentRepository } from '../../domain/repositories/student.repository.interface';

@Injectable()
export class PrismaStudentRepository implements IStudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get client() {
    return PrismaTransactionContext.getClient() ?? this.prisma;
  }

  async findByUserId(userId: string): Promise<Student | null> {
    const student = await this.client.student.findUnique({
      where: { id: userId },
    });
    if (!student) return null;

    return Student.create(student.id, {
      userId: student.id,
      school: student.school,
      learningGoal: student.learningGoal,
    });
  }

  async save(student: Student): Promise<void> {
    await this.client.student.update({
      where: { id: student.userId },
      data: {
        school: student.school ?? null,
        learningGoal: student.learningGoal ?? null,
      },
    });
  }

  async updateGrades(studentId: string, gradeIds: string[]): Promise<void> {
    await this.client.studentGrade.deleteMany({ where: { studentId } });
    if (gradeIds.length > 0) {
      await this.client.studentGrade.createMany({
        data: gradeIds.map((gradeId) => ({ studentId, gradeId })),
      });
    }
  }

  async updateSubjects(studentId: string, subjectIds: string[]): Promise<void> {
    await this.client.studentSubject.deleteMany({ where: { studentId } });
    if (subjectIds.length > 0) {
      await this.client.studentSubject.createMany({
        data: subjectIds.map((subjectId) => ({ studentId, subjectId })),
      });
    }
  }
}
