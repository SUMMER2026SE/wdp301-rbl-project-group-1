import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IFileStorage } from '../domain/interfaces/file-storage.service.interface';

@Injectable()
export class StorageService {
  constructor(
    @Inject(IFileStorage) private readonly fileStorage: IFileStorage,
  ) {}

  async createFileUploadUrl(dto: { filename: string; folder: string }) {
    const path = `${dto.folder}/${randomUUID()}-${dto.filename}`;

    return this.fileStorage.createUploadUrl(path);
  }
}
