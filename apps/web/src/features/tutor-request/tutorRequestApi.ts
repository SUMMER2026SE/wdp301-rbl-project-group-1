import { baseApi as api } from "../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    createTutorRequest: build.mutation<
      CreateTutorRequestApiResponse,
      CreateTutorRequestApiArg
    >({
      query: (queryArg) => ({
        url: `/api/tutor-requests`,
        method: "POST",
        body: queryArg.createTutorRequestDto,
      }),
      invalidatesTags: [{ type: "TutorRequest", id: "LIST" }],
    }),
    getTutorRequests: build.query<
      GetTutorRequestsApiResponse,
      GetTutorRequestsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/tutor-requests`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          search: queryArg.search,
          sortBy: queryArg.sortBy,
          sortOrder: queryArg.sortOrder,
          studentId: queryArg.studentId,
          subjectIds: queryArg.subjectIds,
          gradeIds: queryArg.gradeIds,
          mode: queryArg.mode,
          status: queryArg.status,
        },
      }),
      providesTags: [{ type: "TutorRequest", id: "LIST" }],
    }),
    getTutorRequest: build.query<
      GetTutorRequestApiResponse,
      GetTutorRequestApiArg
    >({
      query: (queryArg) => ({ url: `/api/tutor-requests/${queryArg.id}` }),
      providesTags: (_result, _error, arg) => [{ type: "TutorRequest", id: arg.id }],
    }),
    setTutorBid: build.mutation<SetTutorBidApiResponse, SetTutorBidApiArg>({
      query: (queryArg) => ({
        url: `/api/tutor-requests/${queryArg.id}/bids`,
        method: "POST",
        body: queryArg.setTutorBidDto,
      }),
    }),
    acceptTutorBid: build.mutation<
      AcceptTutorBidApiResponse,
      AcceptTutorBidApiArg
    >({
      query: (queryArg) => ({
        url: `/api/tutor-requests/${queryArg.requestId}/bids/${queryArg.bidId}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "TutorRequest", id: "LIST" },
        { type: "TutorRequest", id: arg.requestId },
        { type: "Booking", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as tutorRequestApi };
export type CreateTutorRequestApiResponse =
  /** status 201 Tutor request created successfully. */ {
    success: boolean;
    message: string;
    data: TutorRequestResponseDto;
  };
export type CreateTutorRequestApiArg = {
  createTutorRequestDto: CreateTutorRequestDto;
};
export type GetTutorRequestsApiResponse =
  /** status 200 List of tutor requests returned successfully. */ {
    success: boolean;
    message: string;
    data: TutorRequestResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
export type GetTutorRequestsApiArg = {
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
  /** Filter by student ID */
  studentId?: string;
  /** Filter by one or more subject IDs */
  subjectIds: string[];
  /** Filter by one or more grade IDs */
  gradeIds: string[];
  /** Filter by tutoring mode */
  mode?: "ONLINE" | "AT_HOME";
  /** Filter by request status */
  status?: "OPEN" | "CLOSED" | "CANCELLED";
};
export type GetTutorRequestApiResponse =
  /** status 200 Tutor request returned successfully. */ {
    success: boolean;
    message: string;
    data: TutorRequestResponseDto;
  };
export type GetTutorRequestApiArg = {
  id: string;
};
export type SetTutorBidApiResponse =
  /** status 200 Tutor bid set successfully. */ {
    success: boolean;
    message: string;
    data: TutorBidResponseDto;
  };
export type SetTutorBidApiArg = {
  id: string;
  setTutorBidDto: SetTutorBidDto;
};
export type AcceptTutorBidApiResponse =
  /** status 200 Tutor bid accepted and request closed successfully. */ {
    success: boolean;
    message: string;
    data: AcceptTutorBidResponseDto;
  };
export type AcceptTutorBidApiArg = {
  requestId: string;
  bidId: string;
};
export type TutorBidTutorDto = {
  name: string | null;
  avatarUrl: string | null;
  rating: number;
  reviewCount: number;
};
export type TutorBidResponseDto = {
  id: string;
  requestId: string;
  tutorId: string;
  proposedPrice: number | null;
  message: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  tutor?: TutorBidTutorDto;
};
export type TutorRequestResponseDto = {
  id: string;
  studentId: string;
  subjectId: string | null;
  gradeId: string | null;
  title: string;
  description: string;
  mode: "ONLINE" | "AT_HOME";
  budget: number | null;
  status: "OPEN" | "CLOSED" | "CANCELLED";
  totalSessions?: number;
  createdAt: string;
  subject?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  grade?: {
    id: string;
    name: string;
    slug: string;
    order: number;
  } | null;
  bids?: TutorBidResponseDto[];
};
export type CreateTutorRequestDto = {
  /** Optional subject ID for the request */
  subjectId?: string;
  /** Optional grade ID for the request */
  gradeId?: string;
  /** Short request title */
  title: string;
  /** Detailed tutoring need */
  description: string;
  /** Preferred tutoring mode */
  mode: "ONLINE" | "AT_HOME";
  /** Optional budget for the request */
  budget?: number;
  /** Total number of sessions for the request */
  totalSessions: number;
  /** Optional recurring schedule rules */
  scheduleRules?: {
    /** Day of week, where 0 is Sunday */
    dayOfWeek: number;
    /** Start time in HH:mm format */
    startTime: string;
    /** End time in HH:mm format */
    endTime: string;
  }[];
};
export type SetTutorBidDto = {
  /** Tutor proposed price */
  proposedPrice?: number;
  /** Proposal message from the tutor */
  message?: string;
};
export type AcceptTutorBidResponseDto = {
  id: string;
  requestId: string;
  tutorId: string;
  proposedPrice: number | null;
  message: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  tutor?: TutorBidTutorDto;
  /** Updated request status after accepting the bid */
  requestStatus: "OPEN" | "CLOSED" | "CANCELLED";
  /** The created booking ID after accepting the bid */
  bookingId: string;
};
export const {
  useCreateTutorRequestMutation,
  useGetTutorRequestsQuery,
  useGetTutorRequestQuery,
  useSetTutorBidMutation,
  useAcceptTutorBidMutation,
} = injectedRtkApi;
