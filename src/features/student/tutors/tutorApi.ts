import { baseApi as api } from "../../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTutors: build.query<GetTutorsApiResponse, GetTutorsApiArg | void>({
      query: (queryArg) => ({
        url: `/api/tutors`,
        params: {
          page: queryArg?.page,
          limit: queryArg?.limit,
          search: queryArg?.search,
          sortBy: queryArg?.sortBy,
          sortOrder: queryArg?.sortOrder,
          subjects: queryArg?.subjects,
          levels: queryArg?.levels,
          minPrice: queryArg?.minPrice,
          maxPrice: queryArg?.maxPrice,
          minRating: queryArg?.minRating,
        },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as tutorApi };
export type GetTutorsApiResponse = {
  success: boolean;
  message: string;
  data: TutorResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
export type GetTutorsApiArg = {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  subjects?: string | string[];
  levels?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
};
export type TutorResponseDto = {
  id: string;
  nickname: string | null;
  avatarUrl: string | null;
  bio: string | null;
  specialization: string | null;
  experience: number | null;
  education: string | null;
  pricePerHour: number | null;
  rating: number;
  reviewCount: number;
  studentCount: number;
};
export const { useGetTutorsQuery } = injectedRtkApi;
