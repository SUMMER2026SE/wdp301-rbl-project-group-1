import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryResult } from '../../../../shared/domain/common/query';
import {
  ApiCreatedResponseWrapped,
  ApiOkResponseQueryWrapped,
  ApiOkResponseWrapped,
  ApiOkResponseWrappedNoData,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import {
  QueryApiResponse,
  QueryResponse,
} from '../../../../shared/presentation/responses/query-response';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { CreateConversationCommand } from '../../application/commands/create-conversation/create-conversation.command';
import { CreateConversationResult } from '../../application/commands/create-conversation/create-conversation.result';
import { DeleteMessageCommand } from '../../application/commands/delete-message/delete-message.command';
import { MarkReadCommand } from '../../application/commands/mark-read/mark-read.command';
import { GetConversationsQuery } from '../../application/queries/get-conversations/get-conversations.query';
import { ConversationResultData } from '../../application/queries/get-conversations/get-conversations.result';
import { GetMessagesQuery } from '../../application/queries/get-messages/get-messages.query';
import { MessageResultData } from '../../application/queries/get-messages/get-messages.result';
import {
  CreateConversationDto,
  GetMessagesQueryDto,
  MarkReadDto,
} from '../schemas/create-conversation.dto';
import {
  ConversationResponseDto,
  CreateConversationResponseDto,
} from '../schemas/conversation-response.dto';
import { MessageResponseDto } from '../schemas/message-response.dto';
import { SendMessageDto } from '../schemas/send-message.dto';
import { SendMessageCommand } from '../../application/commands/send-message/send-message.command';

@ApiTags('Chat')
@Controller()
@ApiBearerAuth()
export class ConversationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('conversations')
  @ApiOperation({
    operationId: 'createConversation',
    summary: 'Create or get a direct conversation with another user',
  })
  @ApiCreatedResponseWrapped(CreateConversationResponseDto, {
    description: 'Conversation created successfully.',
  })
  async createConversation(
    @CurrentUser() user: { userId: string },
    @Body() dto: CreateConversationDto,
  ): Promise<BaseResponse<CreateConversationResponseDto>> {
    const result = await this.commandBus.execute<
      CreateConversationCommand,
      CreateConversationResult
    >(new CreateConversationCommand(user.userId, dto.targetUserId));

    return BaseResponse.created(
      CreateConversationResponseDto.fromResult(result),
    );
  }

  @Get('conversations')
  @ApiOperation({
    operationId: 'getMyConversations',
    summary: 'Get all conversations for the current user (inbox)',
  })
  @ApiOkResponseWrapped(ConversationResponseDto, {
    description: 'Conversations returned successfully.',
    isArray: true,
  })
  async getMyConversations(
    @CurrentUser() user: { userId: string },
  ): Promise<BaseResponse<ConversationResponseDto[]>> {
    const results = await this.queryBus.execute<
      GetConversationsQuery,
      ConversationResultData[]
    >(new GetConversationsQuery(user.userId));

    const data = results.map((r) => ConversationResponseDto.fromResult(r));
    return BaseResponse.ok(data);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({
    operationId: 'getConversationMessages',
    summary: 'Get paginated messages in a conversation',
  })
  @ApiOkResponseQueryWrapped(MessageResponseDto, {
    description: 'Messages returned successfully.',
  })
  async getConversationMessages(
    @Param('id') conversationId: string,
    @Query() queryDto: GetMessagesQueryDto,
  ): Promise<QueryApiResponse<MessageResponseDto>> {
    const page = queryDto.page ?? 1;
    const limit = queryDto.limit ?? 50;

    const result = await this.queryBus.execute<
      GetMessagesQuery,
      QueryResult<MessageResultData>
    >(
      new GetMessagesQuery({
        conversationId,
        page,
        limit,
        skip: (page - 1) * limit,
      }),
    );

    const mappedData = result.data.map((msg) =>
      MessageResponseDto.fromResult(msg),
    );
    return QueryResponse.query({ ...result, data: mappedData });
  }

  @Post('conversations/:id/messages')
  @ApiOperation({
    operationId: 'sendMessage',
    summary: 'Send a message in a conversation',
  })
  @ApiCreatedResponseWrapped(MessageResponseDto, {
    description: 'Message sent successfully.',
  })
  async sendMessage(
    @CurrentUser() user: { userId: string },
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
  ): Promise<BaseResponse<MessageResponseDto>> {
    dto.conversationId = conversationId;
    const result = await this.commandBus.execute<
      SendMessageCommand,
      MessageResultData
    >(new SendMessageCommand(user.userId, dto));
    return BaseResponse.created(MessageResponseDto.fromResult(result));
  }

  @Patch('conversations/:id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'markConversationRead',
    summary: 'Mark messages as read up to a given message',
  })
  @ApiOkResponseWrappedNoData({
    description: 'Marked as read successfully.',
  })
  async markAsRead(
    @CurrentUser() user: { userId: string },
    @Param('id') conversationId: string,
    @Body() dto: MarkReadDto,
  ): Promise<BaseResponse<null>> {
    await this.commandBus.execute(
      new MarkReadCommand(user.userId, conversationId, dto.lastMessageId),
    );
    return BaseResponse.ok(null, 'Marked as read successfully');
  }

  @Delete('messages/:id')
  @ApiOperation({
    operationId: 'deleteMessage',
    summary: 'Soft delete a message (sender only)',
  })
  @ApiOkResponseWrappedNoData({
    description: 'Message deleted successfully.',
  })
  async deleteMessage(
    @CurrentUser() user: { userId: string },
    @Param('id') messageId: string,
  ): Promise<BaseResponse<null>> {
    await this.commandBus.execute(
      new DeleteMessageCommand(messageId, user.userId),
    );
    return BaseResponse.noContent();
  }
}
