import '@fastify/multipart';
import type { MultipartFile } from '@fastify/multipart';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { Public } from '../../../auth/presentation/decorators/public.decorator';
import { StorageService } from '../../application/storage.service';

import { PresignDto } from '../schemas/presign.dto';

@ApiTags('Storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Public()
  @Post('files/presign')
  @ApiOperation({ summary: 'Get presigned URL for file upload' })
  presign(@Body() dto: PresignDto) {
    return this.storageService.createFileUploadUrl(dto);
  }

  @Public()
  @Post('images/upload')
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(@Req() req: FastifyRequest) {
    if (!req.isMultipart()) {
      throw new BadRequestException('Request is not multipart');
    }
    const data: MultipartFile | undefined = await req.file();
    if (!data) {
      throw new BadRequestException('File is missing');
    }

    const secureUrl = await this.storageService.uploadImage(
      data.file,
      data.filename,
    );
    return { secure_url: secureUrl };
  }
}
