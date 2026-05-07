import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCourseCommandHandler } from './application/commands/create-course/create-course.handler';
import { CreateGradeCommandHandler } from './application/commands/create-grade/create-grade.handler';
import { CreateSubjectCommandHandler } from './application/commands/create-subject/create-subject.handler';
import { GetCoursesQueryHandler } from './application/queries/get-courses/get-courses.handler';
import { GetGradesQueryHandler } from './application/queries/get-grades/get-grades.handler';
import { GetSubjectsQueryHandler } from './application/queries/get-subjects/get-subjects.handler';
import { ICourseRepository } from './domain/repositories/course.repository.interface';
import { IGradeRepository } from './domain/repositories/grade.repository.interface';
import { ISubjectRepository } from './domain/repositories/subject.repository.interface';
import { PrismaCourseRepository } from './infrastructure/repositories/course.repository.impl';
import { PrismaGradeRepository } from './infrastructure/repositories/grade.repository.impl';
import { PrismaSubjectRepository } from './infrastructure/repositories/subject.repository.impl';
import { CourseController } from './presentation/controllers/course.controller';
import { GradeController } from './presentation/controllers/grade.controller';
import { SubjectController } from './presentation/controllers/subject.controller';
const CommandHandlers = [
  CreateCourseCommandHandler,
  CreateSubjectCommandHandler,
  CreateGradeCommandHandler,
];
const QueryHandlers = [
  GetSubjectsQueryHandler,
  GetGradesQueryHandler,
  GetCoursesQueryHandler,
];
@Module({
  imports: [CqrsModule],
  controllers: [CourseController, SubjectController, GradeController],
  providers: [
    ...CommandHandlers,
    {
      provide: ICourseRepository,
      useClass: PrismaCourseRepository,
    },
    ...QueryHandlers,
    {
      provide: ISubjectRepository,
      useClass: PrismaSubjectRepository,
    },
    {
      provide: IGradeRepository,
      useClass: PrismaGradeRepository,
    },
  ],
  exports: [ICourseRepository, ISubjectRepository, IGradeRepository],
})
export class CourseModule {}
