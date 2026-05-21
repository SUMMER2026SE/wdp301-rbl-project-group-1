import { Global, Module } from '@nestjs/common';
import { IImageStorage } from './domain/interfaces/image-storage.service.interface';
import { IFileStorage } from './domain/interfaces/file-storage.service.interface';
import { CloudinaryService } from './infrastructure/cloudinary/cloudinary.service';
import { SupabaseStorageService } from './infrastructure/supabase/supabase-storage.service';
import { SupabaseClientProvider } from './infrastructure/supabase/supabase.client';
import { StorageController } from './presentation/controllers/storage.controller';
import { StorageService } from './application/storage.service';

@Global()
@Module({
  controllers: [StorageController],
  providers: [
    StorageService,
    {
      provide: IImageStorage,
      useClass: CloudinaryService,
    },
    SupabaseClientProvider,
    {
      provide: IFileStorage,
      useClass: SupabaseStorageService,
    },
  ],
  exports: [IImageStorage, IFileStorage],
})
export class StorageModule {}
