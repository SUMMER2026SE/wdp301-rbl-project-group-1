import { createZodDto } from 'nestjs-zod';
import { z } from '../../infrastructure/documentation/zod/zod';

export const UploadedImageSchema = z
  .object({
    buffer: z
      .custom<Buffer>((val) => Buffer.isBuffer(val))
      .meta({ description: 'File buffer data' }),
    mimetype: z
      .string()
      .meta({ example: 'image/jpeg', description: 'MIME type of the file' }),
  })
  .meta({ id: 'UploadedImageDto' });

export class UploadedImageDto extends createZodDto(UploadedImageSchema) {}
