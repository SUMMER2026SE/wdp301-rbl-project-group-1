import { User } from '../entities/user.entity';

export type FindAllUsersParams = {
  skip: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, string>;
};

export type FindAllUsersResult = {
  items: User[];
  total: number;
};

export const IUserRepository = Symbol('IUserRepository');
export interface IUserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findAll(params: FindAllUsersParams): Promise<FindAllUsersResult>;
}
