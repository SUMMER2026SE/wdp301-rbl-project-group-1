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

    // --- Atomic writes ---
    const { savedUserId } = await this.unitOfWork.execute(async () => {
      // Build User + Tutor profile from the full application data
      const newUser = User.create('', {
        email: application.email,
        password: hashedPassword,
        role: UserRole.TUTOR,
        isActive: true,
        isVerified: true,
        isFlag: false,
        reportCount: 0,
        createdAt: new Date(),
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

      // Approve & link the application to the new user account
      application.approve();
      application.linkUser(savedUser.id);
      await this.tutorApplicationRepository.update(application);

      return { savedUserId: savedUser.id };
    });

    // --- Side effect: send welcome email (outside transaction) ---
    // If this fails, the user account is still created — email can be retried separately.
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
