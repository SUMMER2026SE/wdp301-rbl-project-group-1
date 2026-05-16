import { Injectable } from '@nestjs/common';
import { PrismaTransactionContext } from '../../../../shared/infrastructure/database/prisma/prisma-transaction.context';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Profile } from '../../domain/entities/profile.entity';
import { IProfileRepository } from '../../domain/repositories/profile.repository.interface';

import { ProfileMapper } from '../mappers/profile.mapper';

@Injectable()
export class PrismaProfileRepository implements IProfileRepository {
  private readonly mapper = new ProfileMapper();

  constructor(private readonly prisma: PrismaService) {}

  /** Returns the ambient tx client inside a UoW block, or the root PrismaService. */
  private get client() {
    return PrismaTransactionContext.getClient() ?? this.prisma;
  }

  async save(profile: Profile): Promise<Profile> {
    const data = this.mapper.toPersistence(profile);

    const savedProfile = await this.client.profile.upsert({
      where: { userId: profile.userId },
      create: data,
      update: data,
    });

    return this.mapper.toDomain(savedProfile);
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const profile = await this.client.profile.findUnique({
      where: { userId },
    });

    if (!profile) return null;
    return this.mapper.toDomain(profile);
  }
}
