import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  WsJwtGuard,
  AuthenticatedSocket,
} from '../../../../shared/presentation/guards/ws-jwt.guard';
import { NotificationService } from '../../application/services/notification.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const authToken = client.handshake.auth?.token as string | undefined;
      if (!authToken) throw new Error('Missing token');

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

      client.data.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      // Each user joins their personal room
      const userRoom = `user:${payload.sub}`;
      void client.join(userRoom);

      this.logger.log(
        `[Notification] Client connected: ${client.id} (User: ${payload.sub}) → joined room ${userRoom}`,
      );
    } catch (error) {
      this.logger.error(
        `[Notification] Connection rejected: ${client.id} - ${(error as Error).message}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.data?.user?.userId ?? 'unknown';
    this.logger.log(
      `[Notification] Client disconnected: ${client.id} (User: ${userId})`,
    );
  }

  // ─── Emit to a specific user ─────────────────────────────────────────────

  /**
   * Push a notification payload to a specific user's personal room.
   * Call this from other services/handlers.
   */
  notifyUser(userId: string, payload: Record<string, unknown>): void {
    this.server.to(`user:${userId}`).emit('new_notification', payload);
  }

  // ─── Client events ────────────────────────────────────────────────────────

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('notification:mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody('notificationId') notificationId: string,
  ) {
    if (!notificationId) {
      throw new WsException('notificationId is required');
    }

    const userId = client.data.user.userId;
    await this.notificationService.markRead(userId, notificationId);

    return { event: 'notification:marked_read', data: { notificationId } };
  }
}
