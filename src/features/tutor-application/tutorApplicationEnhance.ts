import { tutorApplicationApi as originalTutorApplicationApi } from "./tutorApplicationApi";

export const tutorApplicationApi = originalTutorApplicationApi.enhanceEndpoints({
  addTagTypes: ["TutorApplication", "User"],
  endpoints: {
    getTutorApplications: {
      providesTags: ["TutorApplication"],
    },
    createTutorApplication: {
      invalidatesTags: ["TutorApplication"],
    },
    approveTutorApplication: {
      invalidatesTags: ["TutorApplication", "User"], // Invalidates user because role changes
    },
    rejectTutorApplication: {
      invalidatesTags: ["TutorApplication"],
    },
  },
});

export const {
  useCreateTutorApplicationMutation,
  useGetTutorApplicationsQuery,
  useApproveTutorApplicationMutation,
  useRejectTutorApplicationMutation,
} = tutorApplicationApi;
