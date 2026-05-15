import { ResourceTypeValue } from '../../../domain/value-objects/resource-type';

export interface ResourceByTutorResultData {
  id: string;
  userId: string;
  name: string;
  url: string;
  type: ResourceTypeValue;
  size: number | null;
  createdAt: Date;
  updatedAt: Date;
}
