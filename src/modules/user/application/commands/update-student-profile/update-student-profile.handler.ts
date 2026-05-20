import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { UserRole } from '../../../../../shared/domain/enums/enums';
import {
  EntityNotFoundException,
  ForbiddenException,
} from '../../../../../shared/domain/exceptions/domain-exception';
import { IStudentRepository } from '../../../domain/repositories/student.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UpdateStudentProfileCommand } from './update-student-profile.command';
import { UpdateStudentProfileResult } from './update-student-profile.result';

@CommandHandler(UpdateStudentProfileCommand)
export class UpdateStudentProfileHandler
  implements
    ICommandHandler<UpdateStudentProfileCommand>,
    ICommand<UpdateStudentProfileCommand, UpdateStudentProfileResult>
{
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IStudentRepository)
    private readonly studentRepository: IStudentRepository,
  ) {}

  async execute(
    command: UpdateStudentProfileCommand,
  ): Promise<UpdateStudentProfileResult> {
    const user = await this.userRepository.findById(command.userId);
    if (!user) throw new EntityNotFoundException('User', command.userId);
    if (user.role !== UserRole.STUDENT) {
      throw new ForbiddenException('Only students can update student profile');
    }

    const student = await this.studentRepository.findByUserId(command.userId);
    if (!student) throw new EntityNotFoundException('Student', command.userId);

    const { data } = command;

    const hasBasicUpdate =
      data.school !== undefined || data.learningGoal !== undefined;

    if (hasBasicUpdate) {
      student.updateProfile(
        data.school !== undefined ? data.school : (student.school ?? null),
        data.learningGoal !== undefined
          ? data.learningGoal
          : (student.learningGoal ?? null),
      );
      await this.studentRepository.save(student);
    }

    if (data.gradeIds !== undefined) {
      await this.studentRepository.updateGrades(student.userId, data.gradeIds);
    }

    if (data.subjectIds !== undefined) {
      await this.studentRepository.updateSubjects(
        student.userId,
        data.subjectIds,
      );
    }

    return new UpdateStudentProfileResult(
      student.userId,
      'Student profile updated successfully',
    );
  }
}
