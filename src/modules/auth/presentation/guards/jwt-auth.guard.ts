import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/auth-metadata.constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser>(
    err: unknown,
    user: unknown,
    info: unknown,
    context: ExecutionContext,
  ): TUser {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      if (err || !user) {
        return null as unknown as TUser; // Guest user
      }
      return user as TUser; // Authenticated user
    }

    // For protected routes, we enforce authentication
    if (err || !user) {
      throw err instanceof Error ? err : new UnauthorizedException();
    }

    return user as TUser;
  }
}
