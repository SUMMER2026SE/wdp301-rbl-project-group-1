import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { IUnitOfWork } from '../../../../../shared/application/interfaces/unit-of-work';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { PrismaTransactionContext } from '../../../../../shared/infrastructure/database/prisma/prisma-transaction.context';
import { ConflictException } from '../../../../../shared/domain/exceptions/domain-exception';
import { UserRole } from '../../../../../shared/domain/enums/enums';
import { Profile } from '../../../../user/domain/entities/profile.entity';
import { User } from '../../../../user/domain/entities/user.entity';
import { IProfileRepository } from '../../../../user/domain/repositories/profile.repository.interface';
import { IUserRepository } from '../../../../user/domain/repositories/user.repository.interface';
import { IHashService } from '../../services/hash.service';
import { EventBus } from '@nestjs/cqrs';
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
    @Inject(IProfileRepository)
    private readonly profileRepository: IProfileRepository,
    @Inject(IHashService) private readonly hashService: IHashService,
    @Inject(IUnitOfWork) private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: EventBus,
    private readonly prisma: PrismaService,
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
      const userToSave = User.create('', {
        email: command.email,
        password: hashedPassword,
        role: command.role,
        isActive: true,
        isVerified: false,
        isFlag: false,
        reportCount: 0,
        createdAt: new Date(),
      });

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

      const profileToSave = Profile.create('', {
        userId: savedUser.id,
        nickname: command.nickname,
        phone: command.phone,
        dateOfBirth: command.dateOfBirth,
      });

      await this.profileRepository.save(profileToSave);

      if (command.role === UserRole.STUDENT && command.studentData) {
        const tx = PrismaTransactionContext.getClient() ?? this.prisma;
        const { school, learningGoal, subjectIds, gradeIds } =
          command.studentData;

        await tx.student.update({
          where: { id: savedUser.id },
          data: {
            school: school ?? null,
            learningGoal: learningGoal ?? null,
          },
        });

        if (subjectIds.length > 0) {
          await tx.studentSubject.createMany({
            data: subjectIds.map((subjectId) => ({
              studentId: savedUser.id,
              subjectId,
            })),
            skipDuplicates: true,
          });
        }

        if (gradeIds.length > 0) {
          await tx.studentGrade.createMany({
            data: gradeIds.map((gradeId) => ({
              studentId: savedUser.id,
              gradeId,
            })),
            skipDuplicates: true,
          });
        }
      }
    });

    dispatchedEvents.forEach((event) => void this.eventBus.publish(event));

    return { userId: savedUserId! };
  }
}
