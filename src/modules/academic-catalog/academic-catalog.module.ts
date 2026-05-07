import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateGradeCommandHandler } from './application/commands/create-grade/create-grade.handler';
import { CreateSubjectCommandHandler } from './application/commands/create-subject/create-subject.handler';
import { GetGradesQueryHandler } from './application/queries/get-grades/get-grades.handler';
import { GetSubjectsQueryHandler } from './application/queries/get-subjects/get-subjects.handler';
import { IGradeRepository } from './domain/repositories/grade.repository.interface';
import { ISubjectRepository } from './domain/repositories/subject.repository.interface';
import { PrismaGradeRepository } from './infrastructure/repositories/grade.repository.impl';
import { PrismaSubjectRepository } from './infrastructure/repositories/subject.repository.impl';
import { GradeController } from './presentation/controllers/grade.controller';
import { SubjectController } from './presentation/controllers/subject.controller';

const CommandHandlers = [
  CreateGradeCommandHandler,
  CreateSubjectCommandHandler,
];

const QueryHandlers = [GetGradesQueryHandler, GetSubjectsQueryHandler];

@Module({
  imports: [CqrsModule],
  controllers: [GradeController, SubjectController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: IGradeRepository,
      useClass: PrismaGradeRepository,
    },
    {
      provide: ISubjectRepository,
      useClass: PrismaSubjectRepository,
    },
  ],
  exports: [IGradeRepository, ISubjectRepository],
})
export class AcademicCatalogModule {}
