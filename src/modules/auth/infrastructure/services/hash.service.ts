import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IHashService } from '../../application/services/hash.service';

@Injectable()
export class BcryptService implements IHashService {
  async hash(password: string) {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
