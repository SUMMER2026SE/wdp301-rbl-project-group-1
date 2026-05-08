import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import {
  UserIdentity,
  type UserIdentityProvider,
} from '../../domain/entities/user-identity.entity';
import { IUserIdentityRepository } from '../../domain/repositories/user-identity.repository.interface';

type UserIdentityPersistence = {
  userId: string;
  provider: UserIdentityProvider;
  providerUserId: string;
  email: string | null;
  emailVerified: boolean;
  avatarUrl: string | null;
  createdAt: Date;
};

type UserIdentityRow = UserIdentityPersistence & {
  id: string;
  updatedAt: Date;
};

interface UserIdentityDelegateLike {
  upsert(args: {
    where: {
      provider_providerUserId: {
        provider: UserIdentityProvider;
        providerUserId: string;
      };
    };
    create: UserIdentityPersistence;
    update: {
      userId: string;
      email: string | null;
      emailVerified: boolean;
      avatarUrl: string | null;
    };
  }): Promise<UserIdentityRow>;
  findUnique(args: {
    where:
      | {
          provider_providerUserId: {
            provider: UserIdentityProvider;
            providerUserId: string;
          };
        }
      | {
          userId_provider: {
            userId: string;
            provider: UserIdentityProvider;
          };
        }
      | {
          id: string;
        };
  }): Promise<UserIdentityRow | null>;
}

@Injectable()
export class PrismaUserIdentityRepository implements IUserIdentityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(userIdentity: UserIdentity): Promise<UserIdentity> {
    const data: UserIdentityPersistence = {
      userId: userIdentity.userId,
      provider: String(userIdentity.provider),
      providerUserId: userIdentity.providerUserId,
      email: userIdentity.email ?? null,
      emailVerified: userIdentity.emailVerified,
      avatarUrl: userIdentity.avatarUrl ?? null,
      createdAt: userIdentity.createdAt,
    };

    const prisma = this.prisma as unknown as {
      userIdentity: UserIdentityDelegateLike;
    };

    const savedIdentity = await prisma.userIdentity.upsert({
      where: {
        provider_providerUserId: {
          provider: String(data.provider),
          providerUserId: data.providerUserId,
        },
      },
      create: data,
      update: {
        userId: data.userId,
        email: data.email,
        emailVerified: data.emailVerified,
        avatarUrl: data.avatarUrl,
      },
    });

    return UserIdentity.create(savedIdentity.id, {
      userId: savedIdentity.userId,
      provider: String(savedIdentity.provider),
      providerUserId: savedIdentity.providerUserId,
      email: savedIdentity.email ?? undefined,
      emailVerified: savedIdentity.emailVerified,
      avatarUrl: savedIdentity.avatarUrl ?? undefined,
      createdAt: savedIdentity.createdAt,
    });
  }

  async findByProviderAndProviderUserId(
    provider: UserIdentityProvider,
    providerUserId: string,
  ): Promise<UserIdentity | null> {
    const prisma = this.prisma as unknown as {
      userIdentity: UserIdentityDelegateLike;
    };

    const userIdentity = await prisma.userIdentity.findUnique({
      where: {
        provider_providerUserId: {
          provider: String(provider),
          providerUserId,
        },
      },
    });

    if (!userIdentity) {
      return null;
    }

    return UserIdentity.create(userIdentity.id, {
      userId: userIdentity.userId,
      provider: String(userIdentity.provider),
      providerUserId: userIdentity.providerUserId,
      email: userIdentity.email ?? undefined,
      emailVerified: userIdentity.emailVerified,
      avatarUrl: userIdentity.avatarUrl ?? undefined,
      createdAt: userIdentity.createdAt,
    });
  }

  async findByUserIdAndProvider(
    userId: string,
    provider: UserIdentityProvider,
  ): Promise<UserIdentity | null> {
    const prisma = this.prisma as unknown as {
      userIdentity: UserIdentityDelegateLike;
    };

    const userIdentity = await prisma.userIdentity.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: String(provider),
        },
      },
    });

    if (!userIdentity) {
      return null;
    }

    return UserIdentity.create(userIdentity.id, {
      userId: userIdentity.userId,
      provider: String(userIdentity.provider),
      providerUserId: userIdentity.providerUserId,
      email: userIdentity.email ?? undefined,
      emailVerified: userIdentity.emailVerified,
      avatarUrl: userIdentity.avatarUrl ?? undefined,
      createdAt: userIdentity.createdAt,
    });
  }
}
