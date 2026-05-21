import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_CLIENT = Symbol('SUPABASE_CLIENT');

export const SupabaseClientProvider: Provider = {
  provide: SUPABASE_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const url = configService.get<string>('supabase.url');
    const key = configService.get<string>('supabase.key');

    if (!url || !key) {
      throw new Error('Supabase configuration is missing');
    }

    return createClient(url, key);
  },
};
