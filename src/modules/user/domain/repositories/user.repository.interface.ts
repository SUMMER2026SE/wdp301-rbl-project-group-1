import { User } from '../entities/user.entity';

export abstract class IUserRepository {
  abstract save(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: number): Promise<User | null>;
}
