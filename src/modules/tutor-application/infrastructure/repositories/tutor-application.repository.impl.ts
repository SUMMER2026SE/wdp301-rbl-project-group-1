import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../../generated/prisma/client';
import {
  QueryResult,
  createQueryResult,
} from '../../../../shared/domain/common/query';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { TutorApplication } from '../../domain/entities/tutor-application.entity';
import {
  FindTutorApplicationsParams,
  TutorApplicationRepository,
} from '../../domain/repositories/tutor-application.repository';
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
      data: {
        ...data,
        subjects: {
          create:
            application.subjectIds?.map((id) => ({ subjectId: id })) || [],
        },
        grades: {
          create: application.gradeIds?.map((id) => ({ gradeId: id })) || [],
        },
      },
      include: {
        subjects: { include: { subject: true } },
        grades: { include: { grade: true } },
      },
    });

    return this.mapper.toDomain(savedApplication);
  }

  async findByEmail(email: string): Promise<TutorApplication | null> {
    const application = await this.tutorApplicationDelegate.findUnique({
      where: { email },
      include: {
        subjects: { include: { subject: true } },
        grades: { include: { grade: true } },
      },
    });

    if (!application) {
      return null;
    }

    return this.mapper.toDomain(application);
  }

  async findById(id: string): Promise<TutorApplication | null> {
    const application = await this.tutorApplicationDelegate.findUnique({
      where: { id },
      include: {
        subjects: { include: { subject: true } },
        grades: { include: { grade: true } },
      },
    });

    if (!application) {
      return null;
    }

    return this.mapper.toDomain(application);
  }

  async update(application: TutorApplication): Promise<TutorApplication> {
    const data = this.mapper.toPersistence(application);

    const updated = await this.tutorApplicationDelegate.update({
      where: { id: application.id },
      data,
      include: {
        subjects: { include: { subject: true } },
        grades: { include: { grade: true } },
      },
    });

    return this.mapper.toDomain(updated);
  }

  async findAll(
    params: FindTutorApplicationsParams,
  ): Promise<QueryResult<TutorApplication>> {
    const where: Prisma.TutorApplicationWhereInput = {};

    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { specialization: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.status) {
      where.status = params.status as Prisma.EnumTutorApplicationStatusFilter;
    } else if (params.filters && params.filters.status) {
      where.status = params.filters
        .status as Prisma.EnumTutorApplicationStatusFilter;
    }

    let orderBy: Prisma.TutorApplicationOrderByWithRelationInput = {};
    if (params.sortBy) {
      orderBy = {
        [params.sortBy]: params.sortOrder || 'desc',
      };
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const [total, records] = await Promise.all([
      this.tutorApplicationDelegate.count({ where }),
      this.tutorApplicationDelegate.findMany({
        where,
        skip: params.skip,
        take: params.limit,
        orderBy,
        include: {
          subjects: { include: { subject: true } },
          grades: { include: { grade: true } },
        },
      }),
    ]);

    const applications = records.map((record) => this.mapper.toDomain(record));

    return createQueryResult(applications, total, params);
  }
}
