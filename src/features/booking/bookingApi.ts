import { baseApi as api } from "../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getBookings: build.query<GetBookingsApiResponse, GetBookingsApiArg>({
      query: (queryArg) => ({
        url: `/api/bookings`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          status: queryArg.status,
          mode: queryArg.mode,
        },
      }),
      providesTags: [{ type: "Booking", id: "LIST" }],
    }),
    getBookingById: build.query<
      GetBookingByIdApiResponse,
      GetBookingByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/bookings/${queryArg.id}`,
      }),
      providesTags: (_result, _error, arg) => [{ type: "Booking", id: arg.id }],
    }),
    createDirectBooking: build.mutation<
      CreateDirectBookingApiResponse,
      CreateDirectBookingApiArg
    >({
      query: (queryArg) => ({
        url: `/api/bookings/direct`,
        method: "POST",
        body: queryArg.createDirectBookingDto,
      }),
      invalidatesTags: [{ type: "Booking", id: "LIST" }],
    }),
    acceptBooking: build.mutation<
      AcceptBookingApiResponse,
      AcceptBookingApiArg
    >({
      query: (queryArg) => ({
        url: `/api/bookings/${queryArg.id}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Booking", id: "LIST" },
        { type: "Booking", id: arg.id },
      ],
    }),
    rejectBooking: build.mutation<
      RejectBookingApiResponse,
      RejectBookingApiArg
    >({
      query: (queryArg) => ({
        url: `/api/bookings/${queryArg.id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Booking", id: "LIST" },
        { type: "Booking", id: arg.id },
      ],
    }),
    markSessionAttendance: build.mutation<
      MarkSessionAttendanceApiResponse,
      MarkSessionAttendanceApiArg
    >({
      query: (queryArg) => ({
        url: `/api/bookings/sessions/${queryArg.sessionId}/attendance`,
        method: "PATCH",
        body: queryArg.markSessionAttendanceDto,
      }),
    }),
    takeAttendance: build.mutation<TakeAttendanceApiResponse, TakeAttendanceApiArg>({
      query: (queryArg) => ({
        url: `/api/bookings/sessions/${queryArg.sessionId}/attendance`,
        method: "POST",
        body: queryArg.takeAttendanceDto,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Booking", id: arg.bookingId },
      ],
    }),
    getMySessions: build.query<GetMySessionsApiResponse, GetMySessionsApiArg>({
      query: (queryArg) => ({
        url: `/api/bookings/sessions/my`,
        params: {
          startDate: queryArg.startDate,
          endDate: queryArg.endDate,
        },
      }),
    }),
    getTutorPublicSessions: build.query<
      GetMySessionsApiResponse,
      GetTutorPublicSessionsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/bookings/sessions/tutor/${queryArg.tutorId}`,
        params: {
          startDate: queryArg.startDate,
          endDate: queryArg.endDate,
        },
      }),
    }),
    createBookingReview: build.mutation<
      CreateBookingReviewApiResponse,
      CreateBookingReviewApiArg
    >({
      query: (queryArg) => ({
        url: `/api/bookings/${queryArg.bookingId}/reviews`,
        method: "POST",
        body: queryArg.createReviewDto,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as bookingApi };

export type CreateDirectBookingApiResponse =
  /** status 201 Booking created successfully with status PENDING. */ {
    success: boolean;
    message: string;
    data: CreateDirectBookingResponseDto;
  };
export type CreateDirectBookingApiArg = {
  createDirectBookingDto: CreateDirectBookingDto;
};
export type AcceptBookingApiResponse =
  /** status 200 Booking accepted successfully. */ {
    success: boolean;
    message: string;
    data: BookingStatusUpdateResponseDto;
  };
export type AcceptBookingApiArg = {
  id: string;
};
export type RejectBookingApiResponse =
  /** status 200 Booking rejected successfully. */ {
    success: boolean;
    message: string;
    data: BookingStatusUpdateResponseDto;
  };
export type RejectBookingApiArg = {
  id: string;
};
export type CreateBookingReviewApiResponse = {
  success: boolean;
  message: string;
  data: CreateReviewResponseDto;
};
export type CreateBookingReviewApiArg = {
  bookingId: string;
  createReviewDto: CreateReviewDto;
};

export type ScheduleRuleDto = {
  /** Day of week, where 0 is Sunday */
  dayOfWeek: number;
  /** Start time in HH:mm format */
  startTime: string;
  /** End time in HH:mm format */
  endTime: string;
};

export type CreateDirectBookingDto = {
  /** ID of the tutor to book */
  tutorId: string;
  /** Optional subject ID */
  subjectId?: string;
  /** Tutoring mode: ONLINE or AT_HOME */
  mode: "ONLINE" | "AT_HOME";
  /** Optional message / learning goals */
  message?: string;
  /** Weekly recurring schedule slots selected by student */
  scheduleRules: ScheduleRuleDto[];
  /** Total number of sessions requested */
  totalSessions: number;
};

export type CreateDirectBookingResponseDto = {
  /** Created booking ID */
  bookingId: string;
  studentId: string;
  tutorId: string;
  subjectId: string | null;
  mode: "ONLINE" | "AT_HOME";
  status:
    | "PENDING"
    | "AWAITING_PAYMENT"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED";
  message: string | null;
  createdAt: string;
};

export type BookingStatusUpdateResponseDto = {
  /** Booking ID */
  bookingId: string;
  /** Updated booking status */
  status:
    | "PENDING"
    | "AWAITING_PAYMENT"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED";
};
export type GetBookingsApiResponse = {
  success: boolean;
  message: string;
  data: BookingResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type GetBookingsApiArg = {
  page?: number;
  limit?: number;
  status?:
    | "PENDING"
    | "AWAITING_PAYMENT"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED";
  mode?: "ONLINE" | "AT_HOME";
};

export type GetBookingByIdApiResponse = {
  success: boolean;
  message: string;
  data: BookingResponseDto;
};

export type GetBookingByIdApiArg = {
  id: string;
};

export type BookingResponseDto = {
  id: string;
  studentId: string;
  tutorId: string;
  subjectId: string | null;
  mode: "ONLINE" | "AT_HOME";
  status:
    | "PENDING"
    | "AWAITING_PAYMENT"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED";
  price: number | null;
  message: string | null;
  createdAt: string;
  student: {
    id: string;
    nickname: string | null;
    avatarUrl: string | null;
  };
  tutor: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  subject: {
    id: string;
    name: string;
    slug: string;
  } | null;
  scheduleRules: ScheduleRuleDto[];
};

export type MarkSessionAttendanceDto = {
  studentId: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  notes?: string;
};

export type MarkSessionAttendanceResponseDto = {
  id: string;
  sessionId: string;
  studentId: string;
  status: string;
  notes: string | null;
  createdAt: string;
};

export type MarkSessionAttendanceApiResponse = {
  success: boolean;
  message: string;
  data: MarkSessionAttendanceResponseDto;
};

export type MarkSessionAttendanceApiArg = {
  sessionId: string;
  markSessionAttendanceDto: MarkSessionAttendanceDto;
};

export type TakeAttendanceDto = {
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  notes?: string;
};

export type TakeAttendanceResponseDto = {
  id: string;
  sessionId: string;
  studentId: string;
  status: string;
  notes: string | null;
  sessionStatus: string;
  createdAt: string;
};

export type TakeAttendanceApiResponse = {
  success: boolean;
  message: string;
  data: TakeAttendanceResponseDto;
};

export type TakeAttendanceApiArg = {
  sessionId: string;
  bookingId: string;
  takeAttendanceDto: TakeAttendanceDto;
};

export type GetMySessionsApiResponse = {
  data: {
    id: string;
    bookingId: string | null;
    tutorRequestId: string | null;
    title: string | null;
    startTime: string;
    endTime: string;
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
    meetingUrl: string | null;
    notes: string | null;
    order: number | null;
    createdAt: string;
    counterpartName: string;
    subjectName: string;
    subjectId: string;
  }[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type GetMySessionsApiArg = {
  startDate?: string;
  endDate?: string;
};

export type GetTutorPublicSessionsApiArg = {
  tutorId: string;
  startDate?: string;
  endDate?: string;
};

export type CreateReviewResponseDto = {
  id: string;
  bookingId: string;
  tutorId: string;
  studentId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

export type CreateReviewDto = {
  rating: number;
  comment?: string | null;
};

export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateDirectBookingMutation,
  useAcceptBookingMutation,
  useRejectBookingMutation,
  useMarkSessionAttendanceMutation,
  useTakeAttendanceMutation,
  useGetMySessionsQuery,
  useGetTutorPublicSessionsQuery,
  useCreateBookingReviewMutation,
} = injectedRtkApi;
