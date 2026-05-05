import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCreatedResponseWrapped } from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { Public } from '../../../auth/presentation/decorators/public.decorator';
import { CreateTutorApplicationCommand } from '../../application/command/create-tutor-application/create-tutor-application.query';
import { CreateTutorApplicationResult } from '../../application/command/create-tutor-application/create-tutor-application.result';
import { CreateTutorApplicationDto } from '../schemas/create-tutor-application.dto';
import { CreateTutorApplicationResponseDto } from '../schemas/tutor-application-response.dto';

@ApiTags('Tutor Application')
@Controller('tutor-applications')
export class TutorApplicationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @Post()
  @ApiOperation({
    operationId: 'createTutorApplication',
    summary: 'Create a new tutor application via email',
  })
  @ApiCreatedResponseWrapped(CreateTutorApplicationResponseDto, {
    description: 'Tutor application created successfully.',
  })
  async createTutorApplication(
    @Body() dto: CreateTutorApplicationDto,
  ): Promise<BaseResponse<CreateTutorApplicationResponseDto>> {
    const result = await this.commandBus.execute<
      CreateTutorApplicationCommand,
      CreateTutorApplicationResult
    >(
      new CreateTutorApplicationCommand(
        dto.email,
        dto.specialization,
        dto.bio,
        dto.experience,
        dto.education,
        dto.pricePerHour,
      ),
    );

    return BaseResponse.created(
      CreateTutorApplicationResponseDto.fromResult(result),
    );
  }
}
