import { Injectable } from '@nestjs/common';
import { Profile as PrismaProfile } from '../../../../../generated/prisma/client';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { Gender } from '../../../../shared/domain/enums/enums';
import { Profile } from '../../domain/entities/profile.entity';
import { IProfileRepository } from '../../domain/repositories/profile.repository.interface';

@Injectable()
export class PrismaProfileRepository implements IProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(profilePrisma: PrismaProfile): Profile {
    return Profile.create(profilePrisma.id, {
      userId: profilePrisma.userId,
      nickname: profilePrisma.nickname,
      avatarUrl: profilePrisma.avatarUrl ?? undefined,
      phone: profilePrisma.phone,
      dateOfBirth: profilePrisma.dateOfBirth,
      gender: (profilePrisma.gender as Gender) ?? undefined,
      address: profilePrisma.address ?? undefined,
    });
  }

  async save(profile: Profile): Promise<Profile> {
    const data = {
      userId: profile.userId,
      nickname: profile.nickname,
      avatarUrl: profile.avatarUrl ?? null,
      phone: profile.phone,
      dateOfBirth: profile.dateOfBirth,
      gender: profile.gender ?? null,
      address: profile.address ?? null,
    };

    const savedProfile = await this.prisma.profile.upsert({
      where: { userId: profile.userId },
      create: data,
      update: data,
    });

    return this.mapToDomain(savedProfile);
  }

  async findByUserId(userId: number): Promise<Profile | null> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) return null;
    return this.mapToDomain(profile);
  }
}
