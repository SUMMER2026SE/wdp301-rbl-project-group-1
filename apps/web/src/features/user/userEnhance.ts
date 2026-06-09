import { userApi as originalUserApi } from "./userApi";

export const userApi = originalUserApi.enhanceEndpoints({
  addTagTypes: ["User"],
  endpoints: {
    getUsers: {
      providesTags: ["User"],
    },
    getProfile: {
      providesTags: ["User"],
    },
    updateProfile: {
      invalidatesTags: ["User"],
    },
    getUserProfileById: {
      providesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    },
    changeAvatar: {
      invalidatesTags: ["User"],
      query: (queryArg) => {
        const formData = new FormData();
        if (queryArg.body.avatar) {
          formData.append("avatar", queryArg.body.avatar);
        }
        return {
          url: `/api/users/avatar`,
          method: "PATCH",
          body: formData,
        };
      },
    },
    upgradeTutor: {
      invalidatesTags: ["User"],
    },
    updateTutorProfile: {
      invalidatesTags: ["User"],
    },
    updateStudentProfile: {
      invalidatesTags: ["User"],
    },
  },
});

export const {
  useGetUsersQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUserProfileByIdQuery,
  useChangeAvatarMutation,
  useUpgradeTutorMutation,
  useUpdateTutorProfileMutation,
  useUpdateStudentProfileMutation,
} = userApi;
