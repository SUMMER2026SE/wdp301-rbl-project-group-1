export type PrismaRefreshTokenRecord = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  revoked: boolean;
};

export type RefreshTokenWriteData = {
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  revoked: boolean;
};

export type RefreshTokenDelegate = {
  findUnique(args: {
    where: { token: string };
  }): Promise<PrismaRefreshTokenRecord | null>;
  create(args: {
    data: RefreshTokenWriteData;
  }): Promise<PrismaRefreshTokenRecord>;
  update(args: {
    where: { id: string };
    data: RefreshTokenWriteData;
  }): Promise<PrismaRefreshTokenRecord>;
};
