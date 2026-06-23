import { baseApi as api } from "../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getRecommendedTutors: build.query<
      GetRecommendedTutorsApiResponse,
      GetRecommendedTutorsApiArg
    >({
      query: () => ({ url: `/api/recommendations/tutors` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as recommendationApi };
export type GetRecommendedTutorsApiResponse = /** status 200  */ {
  success: boolean;
  message: string;
  data: RecommendedTutorItemDto[];
};
export type GetRecommendedTutorsApiArg = void;
export type RecommendedTutorItemDto = {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  specialization: string | null;
  experience: number | null;
  education: string | null;
  pricePerHour: number | null;
  rating: number;
  reviewCount: number;
  studentCount: number;
  subjects: {
    id: string;
    name: string;
    slug: string;
  }[];
  grades: {
    id: string;
    name: string;
    slug: string;
  }[];
};
export const { useGetRecommendedTutorsQuery } = injectedRtkApi;
