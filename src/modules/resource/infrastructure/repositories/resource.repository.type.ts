import { ResourceTypeValue } from '../../domain/value-objects/resource-type';

export type PrismaResourceRecord = {
  id: string;
  userId: string;
  name: string;
  url: string;
  type: ResourceTypeValue;
  size: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ResourceWriteData = Omit<
  PrismaResourceRecord,
  'createdAt' | 'updatedAt' | 'id'
> & {
  id?: string;
  createdAt?: Date;
};

export type ResourceDelegate = {
  findUnique(args: {
    where: { id: string };
  }): Promise<PrismaResourceRecord | null>;
  create(args: { data: ResourceWriteData }): Promise<PrismaResourceRecord>;
};
