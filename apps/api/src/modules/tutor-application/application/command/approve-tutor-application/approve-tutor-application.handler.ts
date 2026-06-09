import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { SendEmailCommand } from '../../../../notification/application/commands/send-email/send-email.command';
import { randomBytes } from 'crypto';
import { IHashService } from '../../../../auth/application/services/hash.service';
import { UserRole } from '../../../../../shared/domain/enums/enums';
import {
  ConflictException,
  EntityNotFoundException,
} from '../../../../../shared/domain/exceptions/domain-exception';
import { IUnitOfWork } from '../../../../../shared/application/interfaces/unit-of-work';
import { IUserRepository } from '../../../../user/domain/repositories/user.repository.interface';
import { User } from '../../../../user/domain/entities/user.entity';
import { Tutor } from '../../../../user/domain/entities/tutor.entity';
import { TutorApplicationRepository } from '../../../domain/repositories/tutor-application.repository';
import { ApproveTutorApplicationCommand } from './approve-tutor-application.command';
import { ApproveTutorApplicationResult } from './approve-tutor-application.result';

import { EventBus } from '@nestjs/cqrs';
import { DomainEvent } from '../../../../../shared/domain/events/domain-event';
import { UserCreatedDomainEvent } from '../../../../user/domain/events/user-created.domain-event';
import { TutorCreatedDomainEvent } from '../../../domain/events/tutor-created.domain-event';
import { PrismaService } from '../../../../../shared/infrastructure/database/prisma/prisma.service';
import { PrismaTransactionContext } from '../../../../../shared/infrastructure/database/prisma/prisma-transaction.context';

@CommandHandler(ApproveTutorApplicationCommand)
export class ApproveTutorApplicationHandler implements ICommandHandler<
  ApproveTutorApplicationCommand,
  ApproveTutorApplicationResult
> {
  constructor(
    @Inject(TutorApplicationRepository)
    private readonly tutorApplicationRepository: TutorApplicationRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IHashService)
    private readonly hashService: IHashService,
    @Inject(IUnitOfWork)
    private readonly unitOfWork: IUnitOfWork,
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    command: ApproveTutorApplicationCommand,
  ): Promise<ApproveTutorApplicationResult> {
    // --- Pre-flight reads (outside transaction to keep tx short) ---
    const application = await this.tutorApplicationRepository.findById(
      command.id,
    );

    if (!application) {
      throw new EntityNotFoundException('TutorApplication', command.id);
    }

    if (application.status !== 'PENDING') {
      throw new ConflictException(
        `Cannot approve application with status '${application.status}'`,
      );
    }

    const existingUser = await this.userRepository.findByEmail(
      application.email,
    );

    if (existingUser) {
      throw new ConflictException(
        'A user account already exists for this email',
      );
    }

    // Generate credentials before entering transaction
    const temporaryPassword = randomBytes(8).toString('hex');
    const hashedPassword = await this.hashService.hash(temporaryPassword);

    const dispatchedEvents: DomainEvent[] = [];

    const { savedUserId } = await this.unitOfWork.execute(async () => {
      // Build User with consolidated profile fields + Tutor profile
      const newUser = User.create('', {
        email: application.email,
        password: hashedPassword,
        role: UserRole.TUTOR,
        isActive: true,
        isVerified: true,
        isFlag: false,
        reportCount: 0,
        createdAt: new Date(),
        // Profile fields (consolidated into User)
        nickname: application.email.split('@')[0],
        avatarUrl: application.avatarUrl ?? null,
      });

      const tutorProfile = Tutor.create('', {
        userId: '',
        bio: application.bio ?? null,
        specialization: application.specialization,
        experience: application.experience ?? null,
        education: application.education ?? null,
        pricePerHour: application.pricePerHour ?? null,
        rating: 0,
        reviewCount: 0,
        studentCount: 0,
      });
      newUser.setTutor(tutorProfile);

      const savedUser = await this.userRepository.save(newUser);

      // Link subjects & grades using implicit many-to-many on Tutor
      const tx = PrismaTransactionContext.getClient() ?? this.prisma;
      if (application.subjectIds && application.subjectIds.length > 0) {
        await tx.tutor.update({
          where: { id: savedUser.id },
          data: {
            subjects: {
              connect: application.subjectIds.map((id) => ({ id })),
            },
          },
        });
      }

      if (application.gradeIds && application.gradeIds.length > 0) {
        await tx.tutor.update({
          where: { id: savedUser.id },
          data: {
            grades: {
              connect: application.gradeIds.map((id) => ({ id })),
            },
          },
        });
      }

      savedUser.addDomainEvent(
        new UserCreatedDomainEvent(
          savedUser.id,
          savedUser.email,
          'Tutor',
          savedUser.role,
        ),
      );
      savedUser.addDomainEvent(new TutorCreatedDomainEvent(savedUser.id));

      dispatchedEvents.push(...savedUser.domainEvents);
      savedUser.clearDomainEvents();

      application.approve();
      application.linkUser(savedUser.id);
      await this.tutorApplicationRepository.update(application);

      return { savedUserId: savedUser.id };
    });

    dispatchedEvents.forEach((event) => void this.eventBus.publish(event));

    await this.commandBus.execute(
      new SendEmailCommand(
        application.email,
        'Tutor Application Approved',
        'tutor-application-approved',
        { temporaryPassword },
      ),
    );

    return new ApproveTutorApplicationResult(
      application.id,
      savedUserId,
      application.email,
      temporaryPassword,
    );
  }
}
