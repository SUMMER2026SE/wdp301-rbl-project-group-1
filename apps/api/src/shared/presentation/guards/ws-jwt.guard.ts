import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  data: {
    user: {
      userId: string;
      email: string;
      role: string;
    };
  };
}

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient<AuthenticatedSocket>();
      const authToken = client.handshake?.auth?.token as string | undefined;

      if (!authToken) {
        throw new WsException('Missing auth token');
      }

      // Format could be "Bearer xxx" or just "xxx"
      const token = authToken.startsWith('Bearer ')
        ? authToken.split(' ')[1]
        : authToken;

      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
        role: string;
      }>(token, {
        secret: this.configService.get<string>('auth.secretKey'),
      });

      // Attach user object to the socket client
      client.data.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      return true;
    } catch (err) {
      this.logger.error(
        `WebSocket Authentication failed: ${(err as Error).message}`,
      );
      throw new WsException('Unauthorized');
    }
  }
}
