import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma/prisma.service';
import { CACHE_SERVICE } from '../../../../shared/application/constants/cache.constants';
import { ICache } from '../../../../shared/application/interfaces/cache.interface';
import { SendMessageDto } from '../../presentation/schemas/send-message.dto';

import { RedisService } from '../../../../shared/infrastructure/database/redis/redis.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_SERVICE) private readonly cacheService: ICache,
  ) {}

  /**
   * Verify if a user is a participant of a conversation
   */
  async verifyParticipant(
    userId: string,
    conversationId: string,
  ): Promise<boolean> {
    const cacheKey = `chat:participant:${conversationId}:${userId}`;
    const cached = await this.cacheService.get<boolean>(cacheKey);
    if (cached !== null) return cached;

    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: { conversationId, userId },
      },
    });

    const isParticipant = !!participant;
    // Cache for 1 hour
    await this.cacheService.set(cacheKey, isParticipant, 3600);

    return isParticipant;
  }

  /**
   * Save a message to PostgreSQL and cache it in Redis
   */
  async saveMessage(senderId: string, dto: SendMessageDto) {
    // 1. Save to Postgres for persistent storage
    const message = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId,
        content: dto.content,
        type: dto.type,
        fileUrl: dto.fileUrl,
        replyToId: dto.replyToId,
      },
      include: {
        sender: {
          select: {
            id: true,
            nickname: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });

    // 2. Cache latest messages in Redis list
    try {
      if (this.cacheService instanceof RedisService) {
        const redisClient = this.cacheService.getClient();
        const listKey = `chat:messages:${dto.conversationId}`;

        // Push to the left (newest first)
        await redisClient.lpush(listKey, JSON.stringify(message));
        // Keep only the last 50 messages in cache
        await redisClient.ltrim(listKey, 0, 49);
      }
    } catch (error) {
      this.logger.error(
        `Failed to cache message in Redis: ${(error as Error).message}`,
      );
    }

    return message;
  }

  /**
   * Get conversation history (Try Redis first, fallback to DB)
   */
  async getConversationHistory(
    conversationId: string,
    limit: number = 50,
    offset: number = 0,
  ) {
    // Fast path: get from Redis cache if offset is 0
    if (offset === 0 && this.cacheService instanceof RedisService) {
      try {
        const redisClient = this.cacheService.getClient();
        const listKey = `chat:messages:${conversationId}`;
        const cachedMessages = await redisClient.lrange(listKey, 0, limit - 1);

        if (cachedMessages && cachedMessages.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return cachedMessages.map((msg) => JSON.parse(msg));
        }
      } catch {
        this.logger.warn(
          `Redis cache miss or error for conversation ${conversationId}`,
        );
      }
    }

    // Fallback path: get from DB
    const messages = await this.prisma.message.findMany({
      where: { conversationId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        sender: {
          select: { id: true, nickname: true, avatarUrl: true, email: true },
        },
      },
    });

    return messages;
  }

  /**
   * Mark a conversation as read up to a given message for a user
   */
  async markRead(
    userId: string,
    conversationId: string,
    lastMessageId: string,
  ): Promise<void> {
    await this.prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadMessageId: lastMessageId },
    });
  }
}
