import { Injectable } from '@nestjs/common';
import { PrismaTransactionContext } from '../../../../shared/infrastructure/database/prisma/prisma-transaction.context';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Tutor } from '../../domain/entities/tutor.entity';
import { ITutorRepository } from '../../domain/repositories/tutor.repository.interface';

@Injectable()
export class PrismaTutorRepository implements ITutorRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get client() {
    return PrismaTransactionContext.getClient() ?? this.prisma;
  }

  async findByUserId(userId: string): Promise<Tutor | null> {
    const tutor = await this.client.tutor.findUnique({ where: { id: userId } });
    if (!tutor) return null;

    return Tutor.create(tutor.id, {
      userId: tutor.id,
      bio: tutor.bio,
      specialization: tutor.specialization,
      experience: tutor.experience,
      education: tutor.education,
      pricePerHour: tutor.pricePerHour,
      rating: tutor.rating,
      reviewCount: tutor.reviewCount,
      studentCount: tutor.studentCount,
    });
  }

  async save(tutor: Tutor): Promise<void> {
    await this.client.tutor.update({
      where: { id: tutor.userId },
      data: {
        bio: tutor.bio ?? null,
        specialization: tutor.specialization ?? null,
        experience: tutor.experience ?? null,
        education: tutor.education ?? null,
        pricePerHour: tutor.pricePerHour ?? null,
      },
    });
  }
}
