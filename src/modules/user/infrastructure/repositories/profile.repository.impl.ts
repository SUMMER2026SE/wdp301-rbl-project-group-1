import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Profile } from '../../domain/entities/profile.entity';
import { IProfileRepository } from '../../domain/repositories/profile.repository.interface';

import { ProfileMapper } from '../mappers/profile.mapper';

@Injectable()
export class PrismaProfileRepository implements IProfileRepository {
  private readonly mapper = new ProfileMapper();

  constructor(private readonly prisma: PrismaService) {}

  async save(profile: Profile): Promise<Profile> {
    const data = this.mapper.toPersistence(profile);

    const savedProfile = await this.prisma.profile.upsert({
      where: { userId: profile.userId },
      create: data,
      update: data,
    });

    return this.mapper.toDomain(savedProfile);
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) return null;
    return this.mapper.toDomain(profile);
  }
}
