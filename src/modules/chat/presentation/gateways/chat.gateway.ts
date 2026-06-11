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
import { ChatService } from '../../application/services/chat.service';
import { SendMessageDto } from '../schemas/send-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const authToken = client.handshake.auth?.token as string | undefined;
      if (!authToken) {
        throw new Error('Missing token');
      }

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

      this.logger.log(
        `Client connected: ${client.id} (User: ${client.data.user.userId})`,
      );
    } catch (error) {
      this.logger.error(
        `Connection rejected: ${client.id} - ${(error as Error).message}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody('conversationId') conversationId: string,
  ) {
    if (!conversationId) {
      throw new WsException('conversationId is required');
    }

    const userId = client.data.user.userId;
    const isParticipant = await this.chatService.verifyParticipant(
      userId,
      conversationId,
    );

    if (!isParticipant) {
      throw new WsException('You are not a participant of this conversation');
    }

    void client.join(conversationId);
    this.logger.log(`User ${userId} joined conversation ${conversationId}`);

    // Optionally fetch history
    const history =
      await this.chatService.getConversationHistory(conversationId);
    return { event: 'conversation_history', data: history };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leave_conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody('conversationId') conversationId: string,
  ) {
    void client.leave(conversationId);
    this.logger.log(
      `User ${client.data.user.userId} left conversation ${conversationId}`,
    );
    return { event: 'left_conversation', data: { conversationId } };
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: SendMessageDto,
  ) {
    const userId = client.data.user.userId;

    const isParticipant = await this.chatService.verifyParticipant(
      userId,
      payload.conversationId,
    );
    if (!isParticipant) {
      throw new WsException('You are not a participant of this conversation');
    }

    // Save message to DB and Cache
    const savedMessage = await this.chatService.saveMessage(userId, payload);

    // Broadcast message to everyone in the room (including sender if they have multiple tabs open)
    this.server.to(payload.conversationId).emit('new_message', savedMessage);

    return { event: 'message_sent', data: { id: savedMessage.id } };
  }
}
