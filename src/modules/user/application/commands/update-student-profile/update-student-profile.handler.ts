import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { UserRole } from '../../../../../shared/domain/enums/enums';
import {
  EntityNotFoundException,
  ForbiddenException,
} from '../../../../../shared/domain/exceptions/domain-exception';
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
  ) {}

  async execute(
    command: UpdateStudentProfileCommand,
  ): Promise<UpdateStudentProfileResult> {
    const user = await this.userRepository.findById(command.userId);
    if (!user) throw new EntityNotFoundException('User', command.userId);
    if (user.role !== UserRole.STUDENT) {
      throw new ForbiddenException('Only students can update student profile');
    }

    const { data } = command;

    const hasBasicUpdate =
      data.school !== undefined || data.learningGoal !== undefined;

    if (hasBasicUpdate) {
      user.updateStudentProfile(
        data.school !== undefined ? data.school : (user.school ?? null),
        data.learningGoal !== undefined
          ? data.learningGoal
          : (user.learningGoal ?? null),
      );
      await this.userRepository.save(user);
    }

    if (data.gradeIds !== undefined) {
      await this.userRepository.updateStudentGrades(user.id, data.gradeIds);
    }

    if (data.subjectIds !== undefined) {
      await this.userRepository.updateStudentSubjects(user.id, data.subjectIds);
    }

    return new UpdateStudentProfileResult(
      user.id,
      'Student profile updated successfully',
    );
  }
}
