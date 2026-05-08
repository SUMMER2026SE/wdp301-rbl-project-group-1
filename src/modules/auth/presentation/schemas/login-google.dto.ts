import { createZodDto } from 'nestjs-zod';
import { z } from '../../../../shared/infrastructure/documentation/zod/zod';

export const LoginGoogleSchema = z.object({
  idToken: z.string(),
});

export class LoginGoogleDto extends createZodDto(LoginGoogleSchema) {}
