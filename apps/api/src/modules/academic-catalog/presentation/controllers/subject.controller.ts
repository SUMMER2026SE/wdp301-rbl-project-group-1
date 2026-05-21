import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/modules/auth/presentation/decorators/public.decorator';
import {
  ApiCreatedResponseWrapped,
  ApiOkResponseWrapped,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { CreateSubjectCommand } from '../../application/commands/create-subject/create-subject.command';
import { CreateSubjectResult } from '../../application/commands/create-subject/create-subject.result';
import { GetSubjectsQuery } from '../../application/queries/get-subjects/get-subjects.query';
import { GetSubjectsResult } from '../../application/queries/get-subjects/get-subjects.result';
import { CreateSubjectDto } from '../schemas/create-subject.dto';
import { SubjectResponseDto } from '../schemas/subject-reponse.dto';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post() // NOTE: restricting this to ADMIN later
  @Public()
  @ApiOperation({
    operationId: 'createSubject',
    summary: 'Create a new subject',
  })
  @ApiCreatedResponseWrapped(SubjectResponseDto, {
    description: 'Subject created successfully',
  })
  async createSubject(@Body() dto: CreateSubjectDto) {
    const command = new CreateSubjectCommand(dto.name, dto.slug);
    const result = await this.commandBus.execute<
      CreateSubjectCommand,
      CreateSubjectResult
    >(command);
    return BaseResponse.ok(result);
  }

  @Get()
  @Public()
  @ApiOperation({ operationId: 'getAllSubjects', summary: 'Get all subjects' })
  @ApiOkResponseWrapped(SubjectResponseDto, {
    description: 'Subjects retrieved successfully',
    isArray: true,
  })
  async getSubjects() {
    const query = new GetSubjectsQuery();
    const result = await this.queryBus.execute<
      GetSubjectsQuery,
      GetSubjectsResult
    >(query);
    return BaseResponse.ok(result.subjects);
  }
}
