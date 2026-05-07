import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUserRepository } from '../../../../user/domain/repositories/user.repository.interface';
import { TutorApplication } from '../../../domain/entities/tutor-application.entity';
import { TutorApplicationRepository } from '../../../domain/repositories/tutor-application.repository';
import { CreateTutorApplicationCommand } from './create-tutor-application.command';
import { CreateTutorApplicationResult } from './create-tutor-application.result';

@CommandHandler(CreateTutorApplicationCommand)
export class CreateTutorApplicationHandler implements ICommandHandler<
  CreateTutorApplicationCommand,
  CreateTutorApplicationResult
> {
  constructor(
    @Inject(TutorApplicationRepository)
    private readonly tutorApplicationRepository: TutorApplicationRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    command: CreateTutorApplicationCommand,
  ): Promise<CreateTutorApplicationResult> {
    const existingUser = await this.userRepository.findByEmail(command.email);

    if (existingUser) {
      throw new ConflictException(
        'An account with this email already exists in the system. Please login to apply.',
      );
    }

    const existedApplication =
      await this.tutorApplicationRepository.findByEmail(command.email);

    if (existedApplication) {
      throw new ConflictException(
        'A tutor application has already been submitted for this email',
      );
    }

    const applicationEntity = TutorApplication.create('', {
      email: command.email,
      bio: command.bio,
      specialization: command.specialization,
      experience: command.experience,
      education: command.education,
      pricePerHour: command.pricePerHour,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedApplication =
      await this.tutorApplicationRepository.create(applicationEntity);

    return new CreateTutorApplicationResult(
      savedApplication.id,
      savedApplication.status,
      savedApplication.createdAt,
    );
  }
}
