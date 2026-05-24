import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IAiRecommendationService } from '../../domain/services/ai-recommendation.service.interface';

interface AiCourseResponse {
  user_id: string;
  course_recommendations: string[];
}

interface AiTutorResponse {
  user_id: string;
  tutor_recommendations: string[];
}

@Injectable()
export class HttpAiRecommendationService implements IAiRecommendationService {
  private readonly logger = new Logger(HttpAiRecommendationService.name);
  private readonly aiServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiServiceUrl = this.configService.getOrThrow<string>('AI_SERVICE_URL');
  }

  async getRecommendedCourseIds(userId: string): Promise<string[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<AiCourseResponse>(
          `${this.aiServiceUrl}/recommend/courses/${userId}`,
        ),
      );
      return response.data.course_recommendations ?? [];
    } catch (error) {
      this.logger.warn(
        `AI service unavailable for courses (user: ${userId}): ${String(error)}`,
      );
      return [];
    }
  }

  async getRecommendedTutorIds(userId: string): Promise<string[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<AiTutorResponse>(
          `${this.aiServiceUrl}/recommend/tutors/${userId}`,
        ),
      );
      return response.data.tutor_recommendations ?? [];
    } catch (error) {
      this.logger.warn(
        `AI service unavailable for tutors (user: ${userId}): ${String(error)}`,
      );
      return [];
    }
  }
}
