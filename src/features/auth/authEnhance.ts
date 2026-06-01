import { authApi as originalAuthApi, ResetPasswordApiResponse, ResetPasswordDto } from "./authApi";

export const authApi = originalAuthApi
  .enhanceEndpoints({
    addTagTypes: ["User"],
    endpoints: {
      getMe: {
        providesTags: ["User"],
      },
      verifyEmail: {
        invalidatesTags: ["User"],
      },
    },
  })
  .injectEndpoints({
    endpoints: (build) => ({
      resetPassword: build.mutation<
        ResetPasswordApiResponse,
        { resetPasswordDto: ResetPasswordDto; resetToken: string }
      >({
        query: (queryArg) => ({
          url: `/api/auth/reset-password`,
          method: "POST",
          body: queryArg.resetPasswordDto,
          headers: {
            authorization: `Bearer ${queryArg.resetToken}`,
          },
        }),
      }),
    }),
    overrideExisting: true,
  });

export const {
  useRegisterMutation,
  useLoginMutation,
  useLoginGoogleMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useSendVerifyEmailOtpMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
} = authApi;
