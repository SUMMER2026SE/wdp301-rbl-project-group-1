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
  findMany(args?: {
    where?: Record<string, unknown>;
    orderBy?: Record<string, 'asc' | 'desc'>;
    skip?: number;
    take?: number;
  }): Promise<PrismaResourceRecord[]>;
  count(args: { where: Record<string, unknown> }): Promise<number>;
  create(args: { data: ResourceWriteData }): Promise<PrismaResourceRecord>;
};

export type CourseResourceDelegate = {
  create(args: {
    data: { courseId: string; resourceId: string };
  }): Promise<{ courseId: string; resourceId: string }>;
  findMany(args: {
    where: Record<string, unknown>;
    include?: { resource?: boolean };
  }): Promise<{ resourceId: string; resource?: PrismaResourceRecord }[]>;
};

export type LessonResourceDelegate = {
  create(args: {
    data: { lessonId: string; resourceId: string };
  }): Promise<{ lessonId: string; resourceId: string }>;
  findMany(args: {
    where: Record<string, unknown>;
    include?: { resource?: boolean };
  }): Promise<{ resourceId: string; resource?: PrismaResourceRecord }[]>;
};
