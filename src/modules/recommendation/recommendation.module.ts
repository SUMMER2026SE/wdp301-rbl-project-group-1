import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { GetRecommendedTutorsHandler } from './application/queries/get-recommended-tutors/get-recommended-tutors.handler';
import { IAiRecommendationService } from './domain/services/ai-recommendation.service.interface';
import { HttpAiRecommendationService } from './infrastructure/services/http-ai-recommendation.service';
import { RecommendationController } from './presentation/controllers/recommendation.controller';

const QueryHandlers = [
  GetRecommendedTutorsHandler,
];

@Module({
  imports: [
    CqrsModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 3,
    }),
  ],
  controllers: [RecommendationController],
  providers: [
    ...QueryHandlers,
    {
      provide: IAiRecommendationService,
      useClass: HttpAiRecommendationService,
    },
  ],
})
export class RecommendationModule {}
