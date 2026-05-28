import { baseApi as api } from "../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    createTutorApplication: build.mutation<
      CreateTutorApplicationApiResponse,
      CreateTutorApplicationApiArg
    >({
      query: (queryArg) => ({
        url: `/api/tutor-applications`,
        method: "POST",
        body: queryArg.createTutorApplicationDto,
      }),
    }),
    getTutorApplications: build.query<
      GetTutorApplicationsApiResponse,
      GetTutorApplicationsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/tutor-applications`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          search: queryArg.search,
          sortBy: queryArg.sortBy,
          sortOrder: queryArg.sortOrder,
          status: queryArg.status,
        },
      }),
      providesTags: ["TutorApplication"],
    }),
    approveTutorApplication: build.mutation<
      ApproveTutorApplicationApiResponse,
      ApproveTutorApplicationApiArg
    >({
      query: (queryArg) => ({
        url: `/api/tutor-applications/${queryArg.id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["TutorApplication"],
    }),
    rejectTutorApplication: build.mutation<
      RejectTutorApplicationApiResponse,
      RejectTutorApplicationApiArg
    >({
      query: (queryArg) => ({
        url: `/api/tutor-applications/${queryArg.id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["TutorApplication"],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as tutorApplicationApi };
export type CreateTutorApplicationApiResponse =
  /** status 201 Tutor application created successfully. */ {
    success: boolean;
    message: string;
    data: CreateTutorApplicationResponseDto;
  };
export type CreateTutorApplicationApiArg = {
  createTutorApplicationDto: CreateTutorApplicationDto;
};
export type GetTutorApplicationsApiResponse =
  /** status 200 List of tutor applications returned successfully. */ {
    success: boolean;
    message: string;
    data: TutorApplicationResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
export type GetTutorApplicationsApiArg = {
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
  /** Filter by tutor application status */
  status?: "PENDING" | "APPROVED" | "REJECTED";
};
export type ApproveTutorApplicationApiResponse =
  /** status 200 Tutor application approved successfully. */ {
    success: boolean;
    message: string;
    data: ApproveTutorApplicationResponseDto;
  };
export type ApproveTutorApplicationApiArg = {
  id: string;
};
export type RejectTutorApplicationApiResponse =
  /** status 200 Tutor application rejected successfully. */ {
    success: boolean;
    message: string;
    data: RejectTutorApplicationResponseDto;
  };
export type RejectTutorApplicationApiArg = {
  id: string;
};
export type CreateTutorApplicationResponseDto = {
  /** Tutor application ID */
  id: string;
  /** Tutor application status */
  status: "PENDING" | "APPROVED" | "REJECTED";
  /** Creation time of application */
  createdAt: string;
};
export type CreateTutorApplicationDto = {
  /** Applicant email address */
  email: string;
  /** Tutor phone number */
  phone: string;
  /** Tutor address */
  address?: string;
  /** Tutor main specialization */
  specialization: string;
  /** Tutor introduction */
  bio?: string;
  /** Years of teaching experience */
  experience?: number;
  /** Tutor educational background */
  education?: string;
  /** Expected tutoring price per hour */
  pricePerHour?: number;
  /** List of subject IDs the tutor can teach */
  subjectIds: string[];
  /** List of grade IDs the tutor can teach */
  gradeIds: string[];
  /** Tutor avatar URL */
  avatarUrl?: string;
  /** List of file paths stored in Supabase */
  files?: string[];
};
export type TutorApplicationResponseDto = {
  id: string;
  email: string;
  bio?: string | null;
  specialization: string;
  experience?: number | null;
  education?: string | null;
  pricePerHour?: number | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  subjects?: {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
  }[];
  grades?: {
    id: string;
    name: string;
    slug: string;
    order: number;
    createdAt: string;
  }[];
  avatarUrl?: string | null;
  files?: string[];
  createdAt: string;
  updatedAt: string;
};
export type ApproveTutorApplicationResponseDto = {
  /** Tutor application ID */
  applicationId: string;
  /** Newly created tutor user ID */
  userId: string;
  /** Tutor email */
  email: string;
  /** Temporary password for the new tutor account (send via email) */
  temporaryPassword: string;
};
export type RejectTutorApplicationResponseDto = {
  /** Tutor application ID */
  applicationId: string;
  /** Updated application status */
  status: "PENDING" | "APPROVED" | "REJECTED";
};
export const {
  useCreateTutorApplicationMutation,
  useGetTutorApplicationsQuery,
  useApproveTutorApplicationMutation,
  useRejectTutorApplicationMutation,
} = injectedRtkApi;
