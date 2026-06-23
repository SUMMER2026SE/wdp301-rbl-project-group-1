import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { NotificationService } from '../../application/services/notification.service';
import {
  ApiOkResponseWrapped,
  ApiOkResponseWrappedNoData,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { GetNotificationsQueryDto } from '../schemas/notification-response.dto';

@ApiTags('Notifications')
@Controller()
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('notifications')
  @ApiOperation({
    operationId: 'getNotifications',
    summary: 'Get paginated notifications for current user',
  })
  async getNotifications(
    @CurrentUser() user: { userId: string },
    @Query() query: GetNotificationsQueryDto,
  ) {
    const result = await this.notificationService.getUserNotifications(
      user.userId,
      query.page,
      query.limit,
    );
    return {
      success: true,
      message: 'Success',
      data: result.data,
      meta: result.meta,
    };
  }

  @Get('notifications/unread-count')
  @ApiOperation({
    operationId: 'getUnreadNotificationCount',
    summary: 'Get unread notification count for current user',
  })
  @ApiOkResponseWrapped(Number)
  async getUnreadCount(
    @CurrentUser() user: { userId: string },
  ): Promise<BaseResponse<number>> {
    const count = await this.notificationService.getUnreadCount(user.userId);
    return BaseResponse.ok(count);
  }

  @Patch('notifications/:id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'markNotificationRead',
    summary: 'Mark a single notification as read',
  })
  @ApiOkResponseWrappedNoData()
  async markRead(
    @CurrentUser() user: { userId: string },
    @Param('id') notificationId: string,
  ): Promise<BaseResponse<null>> {
    await this.notificationService.markRead(user.userId, notificationId);
    return BaseResponse.ok(null, 'Marked as read');
  }

  @Patch('notifications/read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'markAllNotificationsRead',
    summary: 'Mark all notifications as read',
  })
  @ApiOkResponseWrappedNoData()
  async markAllRead(
    @CurrentUser() user: { userId: string },
  ): Promise<BaseResponse<null>> {
    await this.notificationService.markAllRead(user.userId);
    return BaseResponse.ok(null, 'All marked as read');
  }

  @Delete('notifications/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'deleteNotification',
    summary: 'Delete a single notification',
  })
  @ApiOkResponseWrappedNoData()
  async deleteNotification(
    @CurrentUser() user: { userId: string },
    @Param('id') notificationId: string,
  ): Promise<BaseResponse<null>> {
    await this.notificationService.delete(user.userId, notificationId);
    return BaseResponse.ok(null, 'Deleted successfully');
  }

  @Delete('notifications')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'clearAllNotifications',
    summary: 'Delete all notifications for current user',
  })
  @ApiOkResponseWrappedNoData()
  async clearAllNotifications(
    @CurrentUser() user: { userId: string },
  ): Promise<BaseResponse<null>> {
    await this.notificationService.deleteAll(user.userId);
    return BaseResponse.ok(null, 'All notifications deleted successfully');
  }
}
