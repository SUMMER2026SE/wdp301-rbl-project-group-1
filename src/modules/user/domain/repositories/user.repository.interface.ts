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

export abstract class IUserRepository {
  abstract save(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: string): Promise<User | null>;
  abstract findAll(params: FindAllUsersParams): Promise<FindAllUsersResult>;
}
