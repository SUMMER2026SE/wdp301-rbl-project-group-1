import { baseApi as api } from "../../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTutors: build.query<GetTutorsApiResponse, GetTutorsApiArg>({
      query: (queryArg) => ({
        url: `/api/tutors`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          search: queryArg.search,
          sortBy: queryArg.sortBy,
          sortOrder: queryArg.sortOrder,
          specialization: queryArg.specialization,
          minPrice: queryArg.minPrice,
          maxPrice: queryArg.maxPrice,
        },
      }),
    }),
    getTutorById: build.query<GetTutorByIdApiResponse, GetTutorByIdApiArg>({
      query: (queryArg) => ({ url: `/api/tutors/${queryArg.id}` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as tutorApi };
export type GetTutorsApiResponse =
  /** status 200 List of tutors returned successfully. */ {
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
  /** Page number (starts from 1) */
  page?: string;
  /** Number of items per page (1–100) */
  limit?: string;
  /** Search keyword */
  search?: string;
  /** Field to sort by */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: "asc" | "desc";
  /** Filter by tutor specialization */
  specialization?: string;
  /** Minimum price per hour */
  minPrice?: number;
  /** Maximum price per hour */
  maxPrice?: number;
};
export type GetTutorByIdApiResponse =
  /** status 200 Tutor detail returned successfully. */ {
    success: boolean;
    message: string;
    data: TutorResponseDto;
  };
export type GetTutorByIdApiArg = {
  id: string;
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
  availability?: {
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
  }[];
};
export const { useGetTutorsQuery, useGetTutorByIdQuery } = injectedRtkApi;
