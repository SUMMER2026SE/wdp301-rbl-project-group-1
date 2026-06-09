import { tutorRequestApi as originalTutorRequestApi } from "./tutorRequestApi";

export const tutorRequestApi = originalTutorRequestApi.enhanceEndpoints({
  addTagTypes: ["TutorRequest"],
  endpoints: {
    getTutorRequests: {
      providesTags: ["TutorRequest"],
    },
    createTutorRequest: {
      invalidatesTags: ["TutorRequest"],
    },
  },
});

export const {
  useGetTutorRequestsQuery,
  useCreateTutorRequestMutation,
  useGetTutorRequestQuery,
  useSetTutorBidMutation,
} = tutorRequestApi;
