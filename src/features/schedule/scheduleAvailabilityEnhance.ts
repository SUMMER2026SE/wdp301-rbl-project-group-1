import { scheduleAvailabilityApi as originalScheduleAvailabilityApi } from "./scheduleAvailabilityApi";

export const scheduleAvailabilityApi = originalScheduleAvailabilityApi.enhanceEndpoints({
  addTagTypes: ["ScheduleAvailability"],
  endpoints: {
    getScheduleAvailability: {
      providesTags: ["ScheduleAvailability"],
    },
    updateScheduleAvailability: {
      invalidatesTags: ["ScheduleAvailability"],
    },
  },
});

export const {
  useGetScheduleAvailabilityQuery,
  useUpdateScheduleAvailabilityMutation,
} = scheduleAvailabilityApi;
