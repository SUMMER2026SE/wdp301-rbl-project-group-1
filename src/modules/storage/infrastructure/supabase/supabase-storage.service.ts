import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import { IFileStorage } from '../../domain/interfaces/file-storage.service.interface';
import { SUPABASE_CLIENT } from './supabase.client';

@Injectable()
export class SupabaseStorageService implements IFileStorage {
  private readonly bucket: string;

  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
    private readonly configService: ConfigService,
  ) {
    this.bucket =
      this.configService.get<string>('supabase.bucket') || 'app-files';
  }

  async createUploadUrl(path: string) {
    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .createSignedUploadUrl(path);

    if (error) throw error;

    return {
      path,
      token: data.token,
      signedUrl: data.signedUrl,
    };
  }

  async createDownloadUrl(path: string) {
    const { data, error } = await this.supabase.storage
      .from(this.bucket)
      .createSignedUrl(path, 60);

    if (error) throw error;

    return data.signedUrl;
  }

  async delete(path: string) {
    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([path]);

    if (error) throw error;
  }
}
