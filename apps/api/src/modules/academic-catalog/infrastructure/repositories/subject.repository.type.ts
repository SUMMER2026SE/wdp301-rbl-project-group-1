export type PrismaSubjectRecord = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
};

export type SubjectWriteData = Omit<PrismaSubjectRecord, 'createdAt' | 'id'> & {
  id?: string;
  createdAt?: Date;
};

export type SubjectDelegate = {
  findUnique(args: {
    where: { id: string };
  }): Promise<PrismaSubjectRecord | null>;
  create(args: { data: SubjectWriteData }): Promise<PrismaSubjectRecord>;
  findMany(args?: {
    where?: Record<string, unknown>;
    orderBy?: Record<string, 'asc' | 'desc'>;
  }): Promise<PrismaSubjectRecord[]>;
};
