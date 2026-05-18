import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import {
  ConflictException,
  EntityNotFoundException,
} from '../../../../../shared/domain/exceptions/domain-exception';
import { EnrollmentStatus } from '../../../../../shared/domain/enums/enums';
import { ICourseRepository } from '../../../../course/domain/repositories/course.repository.interface';
import { Enrollment } from '../../../domain/entities/enrollment.entity';
import { IEnrollmentRepository } from '../../../domain/repositories/enrollment.repository.interface';
import { EnrollCourseCommand } from './enroll-course.command';
import { EnrollCourseResult } from './enroll-course.result';

@CommandHandler(EnrollCourseCommand)
export class EnrollCourseCommandHandler
  implements
    ICommandHandler<EnrollCourseCommand>,
    ICommand<EnrollCourseCommand, EnrollCourseResult>
{
  constructor(
    @Inject(IEnrollmentRepository)
    private readonly enrollmentRepository: IEnrollmentRepository,
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(command: EnrollCourseCommand): Promise<EnrollCourseResult> {
    // Verify the course exists
    const course = await this.courseRepository.findById(command.courseId);
    if (!course) {
      throw new EntityNotFoundException('Course', command.courseId);
    }

    // Check for duplicate enrollment
    const existing = await this.enrollmentRepository.findByStudentAndCourse(
      command.studentId,
      command.courseId,
    );
    if (existing) {
      throw new ConflictException('Student is already enrolled in this course');
    }

    const enrollment = Enrollment.create('', {
      studentId: command.studentId,
      courseId: command.courseId,
      status: EnrollmentStatus.PENDING,
      enrolledAt: new Date(),
    });

    const saved = await this.enrollmentRepository.create(enrollment);

    return new EnrollCourseResult(saved.id, saved.status, saved.enrolledAt);
  }
}
