import { tutorApi as originalTutorApi, GetTutorsApiResponse, GetTutorsApiArg as OriginalGetTutorsApiArg } from "./tutorApi";

export type GetTutorsApiArg = OriginalGetTutorsApiArg & {
  subjects?: string[] | string;
  levels?: string[] | string;
  minRating?: number;
};

export const tutorApi = originalTutorApi
  .enhanceEndpoints({
    addTagTypes: ["Tutor"],
    endpoints: {
      getTutorById: {
        providesTags: (result, error, arg) => [{ type: "Tutor", id: arg.id }],
      },
    },
  })
  .injectEndpoints({
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
            subjects: queryArg.subjects,
            levels: queryArg.levels,
            minRating: queryArg.minRating,
          },
        }),
        providesTags: ["Tutor"],
      }),
    }),
    overrideExisting: true,
  });

export const { useGetTutorsQuery, useGetTutorByIdQuery } = tutorApi;
