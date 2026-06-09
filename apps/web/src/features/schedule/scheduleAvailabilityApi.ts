import { baseApi as api } from "../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getScheduleAvailability: build.query<
      GetScheduleAvailabilityApiResponse,
      GetScheduleAvailabilityApiArg
    >({
      query: () => ({ url: `/api/schedule-availability` }),
    }),
    updateScheduleAvailability: build.mutation<
      UpdateScheduleAvailabilityApiResponse,
      UpdateScheduleAvailabilityApiArg
    >({
      query: (queryArg) => ({
        url: `/api/schedule-availability`,
        method: "PATCH",
        body: queryArg.updateScheduleAvailabilityDto,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as scheduleAvailabilityApi };
export type GetScheduleAvailabilityApiResponse =
  /** status 200 Schedule availability returned successfully. */ {
    success: boolean;
    message: string;
    data: ScheduleAvailabilityResponseDto;
  };
export type GetScheduleAvailabilityApiArg = void;
export type UpdateScheduleAvailabilityApiResponse =
  /** status 200 Schedule availability updated successfully. */ {
    success: boolean;
    message: string;
    data: ScheduleAvailabilityResponseDto;
  };
export type UpdateScheduleAvailabilityApiArg = {
  updateScheduleAvailabilityDto: UpdateScheduleAvailabilityDto;
};
export type ScheduleAvailabilitySlotResponseDto = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
};
export type ScheduleAvailabilityResponseDto = {
  userId: string;
  availability: ScheduleAvailabilitySlotResponseDto[];
};
export type UpdateScheduleAvailabilityDto = {
  /** Weekly availability slots */
  availability: {
    /** Day of week, where 0 is Sunday */
    dayOfWeek: number;
    /** Start time in HH:mm format */
    startTime: string;
    /** End time in HH:mm format */
    endTime: string;
  }[];
};
export const {
  useGetScheduleAvailabilityQuery,
  useUpdateScheduleAvailabilityMutation,
} = injectedRtkApi;
