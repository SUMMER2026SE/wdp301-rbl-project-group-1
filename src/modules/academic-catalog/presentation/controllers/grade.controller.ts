import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../auth/presentation/decorators/public.decorator';
import {
  ApiCreatedResponseWrapped,
  ApiOkResponseWrapped,
} from '../../../../shared/presentation/decorators/api-response.decorator';
import { BaseResponse } from '../../../../shared/presentation/responses/base-response';
import { CreateGradeCommand } from '../../application/commands/create-grade/create-grade.command';
import { CreateGradeResult } from '../../application/commands/create-grade/create-grade.result';
import { GetGradesQuery } from '../../application/queries/get-grades/get-grades.query';
import { GetGradesResult } from '../../application/queries/get-grades/get-grades.result';
import { CreateGradeDto } from '../schemas/create-grade.dto';
import { GradeResponseDto } from '../schemas/grade-reponse.dto';

@ApiTags('Grades')
@Controller('grades')
export class GradeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post() // NOTE: restricting this to ADMIN later
  @ApiOperation({ operationId: 'createGrade', summary: 'Create a new grade' })
  @ApiCreatedResponseWrapped(GradeResponseDto, {
    description: 'Grade created successfully',
  })
  async createGrade(@Body() dto: CreateGradeDto) {
    const command = new CreateGradeCommand(dto.name, dto.slug, dto.order);
    const result = await this.commandBus.execute<
      CreateGradeCommand,
      CreateGradeResult
    >(command);
    return BaseResponse.ok(result);
  }

  @Get()
  @Public()
  @ApiOperation({ operationId: 'getAllGrades', summary: 'Get all grades' })
  @ApiOkResponseWrapped(GradeResponseDto, {
    description: 'Returns all grades',
    isArray: true,
  })
  async getGrades() {
    const query = new GetGradesQuery();
    const result = await this.queryBus.execute<GetGradesQuery, GetGradesResult>(
      query,
    );
    return BaseResponse.ok(result.grades);
  }
}
