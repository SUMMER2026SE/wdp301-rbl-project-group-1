import {
  Prisma,
  Profile as PrismaProfile,
} from '../../../../../generated/prisma/client';
import { IMapper } from '../../../../shared/application/interfaces/mapper.interface';
import { Gender } from '../../../../shared/domain/enums/enums';
import { Profile } from '../../domain/entities/profile.entity';

export class ProfileMapper implements IMapper<
  Profile,
  PrismaProfile | Prisma.ProfileUncheckedCreateInput
> {
  toDomain(raw: PrismaProfile): Profile {
    return Profile.create(raw.id, {
      userId: raw.userId,
      nickname: raw.nickname,
      avatarUrl: raw.avatarUrl ?? undefined,
      phone: raw.phone,
      dateOfBirth: raw.dateOfBirth,
      gender: (raw.gender as Gender) ?? undefined,
      address: raw.address ?? undefined,
    });
  }

  toPersistence(domain: Profile): Prisma.ProfileUncheckedCreateInput {
    return {
      userId: domain.userId,
      nickname: domain.nickname,
      avatarUrl: domain.avatarUrl ?? null,
      phone: domain.phone,
      dateOfBirth: domain.dateOfBirth,
      gender: domain.gender ?? null,
      address: domain.address ?? null,
    };
  }
}
