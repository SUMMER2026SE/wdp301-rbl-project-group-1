import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { TutorApplication } from '../../domain/entities/tutor-application.entity';
import { TutorApplicationRepository } from '../../domain/repositories/tutor-application.repository';
import { TutorApplicationMapper } from '../mapper/tutor-application.mapper';
import { TutorApplicationDelegate } from './tutor-application.type';

@Injectable()
export class PrismaTutorApplicationRepository extends TutorApplicationRepository {
  private readonly mapper = new TutorApplicationMapper();

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private get tutorApplicationDelegate(): TutorApplicationDelegate {
    return this.prisma.tutorApplication as unknown as TutorApplicationDelegate;
  }

  async create(application: TutorApplication): Promise<TutorApplication> {
    const data = this.mapper.toPersistence(application);

    const savedApplication = await this.tutorApplicationDelegate.create({
      data,
    });

    return this.mapper.toDomain(savedApplication);
  }

  async findByEmail(email: string): Promise<TutorApplication | null> {
    const application = await this.tutorApplicationDelegate.findUnique({
      where: { email },
    });

    if (!application) {
      return null;
    }

    return this.mapper.toDomain(application);
  }
}
