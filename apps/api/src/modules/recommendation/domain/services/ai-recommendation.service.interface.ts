export const IAiRecommendationService = Symbol('IAiRecommendationService');

export interface IAiRecommendationService {
  getRecommendedCourseIds(userId: string): Promise<string[]>;
  getRecommendedTutorIds(userId: string): Promise<string[]>;
}
