import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, v2 } from 'cloudinary';
import { Readable, Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { IImageStorage } from '../../domain/interfaces/image-storage.service.interface';

/** Service handling business logic for storage via Cloudinary. */
@Injectable()
export class CloudinaryService
  implements IImageStorage, OnModuleInit, OnModuleDestroy
{
  constructor(private readonly config: ConfigService) {
    v2.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async onModuleInit() {}

  async onModuleDestroy() {}

  /**
   * Executes the upload stream operation.
   *
   * @param stream - The stream parameter
   * @param publicId - The publicId parameter
   * @returns Result of type Promise<string>
   */
  async upload(
    stream: Readable,
    publicId: string,
    image?: boolean,
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        {
          folder: `${this.config.get<string>('CLOUDINARY_ROOT_FOLDER', 'Edura')}/${image ? 'images' : 'videos'}`,
          public_id: publicId,
          overwrite: true,
          resource_type: image ? 'image' : 'video',
        },
        (error: Error | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(new Error(error.message));
            return;
          }

          if (!result?.secure_url) {
            reject(new Error('Cloudinary upload did not return secure_url'));
            return;
          }

          resolve(result.secure_url);
        },
      ) as Writable;

      pipeline(stream, uploadStream).catch((error: unknown) => {
        reject(error instanceof Error ? error : new Error(String(error)));
      });
    });
  }
}
