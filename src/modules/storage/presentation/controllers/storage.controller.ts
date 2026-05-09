import { Body, Controller, Post } from '@nestjs/common';
import { StorageService } from '../../application/storage.service';

import { PresignDto } from '../schemas/presign.dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('files/presign')
  presign(@Body() dto: PresignDto) {
    return this.storageService.createFileUploadUrl(dto);
  }
}
