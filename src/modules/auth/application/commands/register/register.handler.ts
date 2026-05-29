import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { IUnitOfWork } from '../../../../../shared/application/interfaces/unit-of-work';
import { ConflictException } from '../../../../../shared/domain/exceptions/domain-exception';
import { UserRole } from '../../../../../shared/domain/enums/enums';
import { User } from '../../../../user/domain/entities/user.entity';
import { IUserRepository } from '../../../../user/domain/repositories/user.repository.interface';
import { IHashService } from '../../services/hash.service';
import { UserCreatedDomainEvent } from '../../../../user/domain/events/user-created.domain-event';
import { RegisterCommand } from './register.command';
import { RegisterResult } from './register.result';
import { DomainEvent } from '../../../../../shared/domain/events/domain-event';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  implements
    ICommandHandler<RegisterCommand>,
    ICommand<RegisterCommand, RegisterResult>
{
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IHashService) private readonly hashService: IHashService,
    @Inject(IUnitOfWork) private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: RegisterCommand): Promise<RegisterResult> {
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.hashService.hash(command.password);

    let savedUserId: string;
    const dispatchedEvents: DomainEvent[] = [];

    await this.unitOfWork.execute(async () => {
      // Profile fields (nickname, phone, dateOfBirth) are now on User directly
      const userToSave = User.create('', {
        email: command.email,
        password: hashedPassword,
        role: command.role,
        isActive: true,
        isVerified: false,
        isFlag: false,
        reportCount: 0,
        createdAt: new Date(),
        nickname: command.nickname ?? null,
        phone: command.phone ?? null,
        dateOfBirth: command.dateOfBirth ?? null,
      });

      // Student fields are also on User
      if (command.role === UserRole.STUDENT && command.studentData) {
        userToSave.updateStudentProfile(
          command.studentData.school ?? null,
          command.studentData.learningGoal ?? null,
        );
      }

      const savedUser = await this.userRepository.save(userToSave);
      savedUserId = savedUser.id;

      savedUser.addDomainEvent(
        new UserCreatedDomainEvent(
          savedUser.id,
          savedUser.email,
          command.nickname,
          savedUser.role,
        ),
      );
      dispatchedEvents.push(...savedUser.domainEvents);
      savedUser.clearDomainEvents();

      // Update M:M relations for student
      if (command.role === UserRole.STUDENT && command.studentData) {
        const { subjectIds, gradeIds } = command.studentData;

        if (subjectIds && subjectIds.length > 0) {
          await this.userRepository.updateStudentSubjects(
            savedUser.id,
            subjectIds,
          );
        }

        if (gradeIds && gradeIds.length > 0) {
          await this.userRepository.updateStudentGrades(savedUser.id, gradeIds);
        }
      }
    });

    dispatchedEvents.forEach((event) => void this.eventBus.publish(event));

    return { userId: savedUserId! };
  }
}
