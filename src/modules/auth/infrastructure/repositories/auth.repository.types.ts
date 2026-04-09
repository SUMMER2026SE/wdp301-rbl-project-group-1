export type PrismaRefreshTokenRecord = {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  revoked: boolean;
};

export type RefreshTokenWriteData = {
  userId: number;
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
    where: { id: number };
    data: RefreshTokenWriteData;
  }): Promise<PrismaRefreshTokenRecord>;
};
