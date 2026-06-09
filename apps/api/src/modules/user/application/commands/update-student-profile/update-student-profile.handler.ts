import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { IMessageBroker } from '../../../../../shared/application/interfaces/message-broker.interface';
import { EVENTS } from '../../../../../shared/application/constants/events.constants';
import { UserRole } from '../../../../../shared/domain/enums/enums';
import {
  EntityNotFoundException,
  ForbiddenException,
} from '../../../../../shared/domain/exceptions/domain-exception';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
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
    @Inject(IMessageBroker) private readonly messageBroker: IMessageBroker,
    private readonly prisma: PrismaService,
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

    if (data.gradeIds !== undefined || data.subjectIds !== undefined) {
      const updatedUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: { subjects: true, grades: true },
      });
      if (updatedUser) {
        await this.messageBroker.publishEvent(EVENTS.USER_CREATED, {
          id: updatedUser.id,
          role: updatedUser.role,
          subjectSlugs: updatedUser.subjects.map((s) => s.slug),
          gradeSlugs: updatedUser.grades.map((g) => g.slug),
        });
      }
    }

    return new UpdateStudentProfileResult(
      user.id,
      'Student profile updated successfully',
    );
  }
}
