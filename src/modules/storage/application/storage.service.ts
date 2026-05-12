import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IFileStorage } from '../domain/interfaces/file-storage.service.interface';
import { IImageStorage } from '../domain/interfaces/image-storage.service.interface';
@Injectable()
export class StorageService {
  constructor(
    @Inject(IFileStorage) private readonly fileStorage: IFileStorage,
    @Inject(IImageStorage) private readonly imageStorage: IImageStorage,
  ) {}

  async createFileUploadUrl(dto: { filename: string; folder: string }) {
    const path = `${dto.folder}/${randomUUID()}-${dto.filename}`;

    return this.fileStorage.createUploadUrl(path);
  }

  async uploadImage(
    stream: import('node:stream').Readable,
    originalname: string,
    folder?: string,
  ) {
    const publicId = `${folder || 'images'}/${randomUUID()}-${originalname}`;
    return this.imageStorage.upload(stream, publicId, true);
  }
}
