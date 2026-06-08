import {
  tutorApi as originalTutorApi,
  GetTutorsApiResponse,
  GetTutorsApiArg as OriginalGetTutorsApiArg,
} from "./tutorApi";

export type GetTutorsApiArg = OriginalGetTutorsApiArg & {
  subjectIds?: string[];
  gradeIds?: string[];
  minRating?: number;
};

export const tutorApi = originalTutorApi
  .enhanceEndpoints({
    addTagTypes: ["Tutor"],
    endpoints: {
      getTutorById: {
        providesTags: (result, error, arg) =>
          result?.data
            ? [
                { type: "Tutor", id: arg.id },
                { type: "Tutor", id: "LIST" },
              ]
            : [{ type: "Tutor", id: arg.id }],
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
            subjectIds: queryArg.subjectIds,
            gradeIds: queryArg.gradeIds,
            minRating: queryArg.minRating,
          },
        }),
        providesTags: (result) =>
          result?.data
            ? [
                { type: "Tutor", id: "LIST" },
                ...result.data.map((tutor) => ({
                  type: "Tutor" as const,
                  id: tutor.id,
                })),
              ]
            : [{ type: "Tutor", id: "LIST" }],
      }),
    }),
    overrideExisting: true,
  });

export const { useGetTutorsQuery, useGetTutorByIdQuery } = tutorApi;
