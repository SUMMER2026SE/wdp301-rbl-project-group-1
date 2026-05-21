import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICommand } from '../../../../../shared/application/interfaces/use-case.interface';
import { UserRole } from '../../../../../shared/domain/enums/enums';
import {
  EntityNotFoundException,
  ForbiddenException,
} from '../../../../../shared/domain/exceptions/domain-exception';
import { ITutorRepository } from '../../../domain/repositories/tutor.repository.interface';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { UpdateTutorProfileCommand } from './update-tutor-profile.command';
import { UpdateTutorProfileResult } from './update-tutor-profile.result';

@CommandHandler(UpdateTutorProfileCommand)
export class UpdateTutorProfileHandler
  implements
    ICommandHandler<UpdateTutorProfileCommand>,
    ICommand<UpdateTutorProfileCommand, UpdateTutorProfileResult>
{
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(ITutorRepository)
    private readonly tutorRepository: ITutorRepository,
  ) {}

  async execute(
    command: UpdateTutorProfileCommand,
  ): Promise<UpdateTutorProfileResult> {
    const user = await this.userRepository.findById(command.userId);
    if (!user) throw new EntityNotFoundException('User', command.userId);
    if (user.role !== UserRole.TUTOR) {
      throw new ForbiddenException('Only tutors can update tutor profile');
    }

    const tutor = await this.tutorRepository.findByUserId(command.userId);
    if (!tutor) throw new EntityNotFoundException('Tutor', command.userId);

    const { data } = command;

    tutor.updateProfile(
      data.bio !== undefined ? data.bio : (tutor.bio ?? null),
      data.specialization !== undefined
        ? data.specialization
        : (tutor.specialization ?? null),
      data.education !== undefined ? data.education : (tutor.education ?? null),
      data.experience !== undefined
        ? data.experience
        : (tutor.experience ?? null),
    );

    if (data.pricePerHour !== undefined) {
      tutor.setPrice(data.pricePerHour);
    }

    await this.tutorRepository.save(tutor);

    return new UpdateTutorProfileResult(
      tutor.userId,
      'Tutor profile updated successfully',
    );
  }
}
