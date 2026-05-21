export type PrismaGradeRecord = {
  id: string;
  name: string;
  slug: string;
  order: number;
  createdAt: Date;
};

export type GradeWriteData = Omit<PrismaGradeRecord, 'createdAt' | 'id'> & {
  id?: string;
  createdAt?: Date;
};

export type GradeDelegate = {
  findUnique(args: {
    where: { id: string };
  }): Promise<PrismaGradeRecord | null>;
  create(args: { data: GradeWriteData }): Promise<PrismaGradeRecord>;
  findMany(args?: {
    where?: Record<string, unknown>;
    orderBy?: Record<string, 'asc' | 'desc'>;
  }): Promise<PrismaGradeRecord[]>;
};
