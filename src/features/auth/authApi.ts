import { baseApi as api } from "../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<RegisterApiResponse, RegisterApiArg>({
      query: (queryArg) => ({
        url: `/api/auth/register`,
        method: "POST",
        body: queryArg.registerDto,
      }),
    }),
    login: build.mutation<LoginApiResponse, LoginApiArg>({
      query: (queryArg) => ({
        url: `/api/auth/login`,
        method: "POST",
        body: queryArg.loginDto,
      }),
    }),
    loginGoogle: build.mutation<LoginGoogleApiResponse, LoginGoogleApiArg>({
      query: (queryArg) => ({
        url: `/api/auth/login-google`,
        method: "POST",
        body: queryArg.loginGoogleDto,
      }),
    }),
    refresh: build.mutation<RefreshApiResponse, RefreshApiArg>({
      query: () => ({ url: `/api/auth/refresh`, method: "POST" }),
    }),
    logout: build.mutation<LogoutApiResponse, LogoutApiArg>({
      query: () => ({ url: `/api/auth/logout`, method: "POST" }),
    }),
    getMe: build.query<GetMeApiResponse, GetMeApiArg>({
      query: () => ({ url: `/api/auth/me` }),
    }),
    forgotPassword: build.mutation<
      ForgotPasswordApiResponse,
      ForgotPasswordApiArg
    >({
      query: (queryArg) => ({
        url: `/api/auth/forgot-password`,
        method: "POST",
        body: queryArg.forgotPasswordDto,
      }),
    }),
    verifyOtp: build.mutation<VerifyOtpApiResponse, VerifyOtpApiArg>({
      query: (queryArg) => ({
        url: `/api/auth/verify-otp`,
        method: "POST",
        body: queryArg.verifyOtpDto,
      }),
    }),
    resetPassword: build.mutation<
      ResetPasswordApiResponse,
      ResetPasswordApiArg
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
  overrideExisting: false,
});
export { injectedRtkApi as authApi };
export type RegisterApiResponse =
  /** status 201 User successfully registered. */ {
    success: boolean;
    message: string;
    data: RegisterResultDto;
  };
export type RegisterApiArg = {
  registerDto: RegisterDto;
};
export type LoginApiResponse = /** status 201 User successfully logged in. */ {
  success: boolean;
  message: string;
  data: LoginResponseDto;
};
export type LoginApiArg = {
  loginDto: LoginDto;
};
export type LoginGoogleApiResponse =
  /** status 201 User successfully logged in with Google. */ {
    success: boolean;
    message: string;
    data: LoginResponseDto;
  };
export type LoginGoogleApiArg = {
  loginGoogleDto: LoginGoogleDto;
};
export type RefreshApiResponse = /** status 201 New access token issued. */ {
  success: boolean;
  message: string;
  data: AuthTokenPairDto;
};
export type RefreshApiArg = void;
export type LogoutApiResponse =
  /** status 200 User successfully logged out. */ {
    success: boolean;
    message: string;
    data?: ((null | null) | (object | null)) | null;
  };
export type LogoutApiArg = void;
export type GetMeApiResponse =
  /** status 200 Current user information returned successfully. */ {
    success: boolean;
    message: string;
    data: MeUserDto;
  };
export type GetMeApiArg = void;
export type ForgotPasswordApiResponse =
  /** status 200 OTP sent to email successfully. */ {
    success: boolean;
    message: string;
    data: ForgotPasswordResultDto;
  };
export type ForgotPasswordApiArg = {
  forgotPasswordDto: ForgotPasswordDto;
};
export type VerifyOtpApiResponse =
  /** status 200 OTP verified successfully. */ {
    success: boolean;
    message: string;
    data: VerifyOtpResultDto;
  };
export type VerifyOtpApiArg = {
  verifyOtpDto: VerifyOtpDto;
};
export type ResetPasswordApiResponse =
  /** status 200 Password has been successfully reset. */ {
    success: boolean;
    message: string;
    data: ResetPasswordResultDto;
  };
export type ResetPasswordApiArg = {
  resetPasswordDto: ResetPasswordDto;
  resetToken: string;
};
export type RegisterResultDto = {
  /** Created user id */
  userId: string;
};
export type RegisterDto = {
  /** The email of the user */
  email: string;
  /** The password of the user */
  password: string;
  /** The role of the user */
  role: "ADMIN" | "TUTOR" | "STUDENT" | "PARENT";
  /** The nickname of the user */
  nickname: string;
  /** Phone number */
  phone: string;
  /** Date of birth */
  dateOfBirth: string;
};
export type LoginUserDto = {
  id: string;
  email: string;
  role: "ADMIN" | "TUTOR" | "STUDENT" | "PARENT";
  nickname: string;
  isActive: boolean;
  isVerified: boolean;
  isFlag: boolean;
  reportCount: number;
  createdAt: string;
};
export type LoginResponseDto = {
  /** JWT access token */
  accessToken: string;
  /** Refresh token used to rotate access token */
  refreshToken: string;
  user: LoginUserDto;
};
export type LoginDto = {
  /** The email of the user */
  email: string;
  /** The password of the user */
  password: string;
};
export type LoginGoogleDto = {
  idToken: string;
};
export type AuthTokenPairDto = {
  /** JWT access token */
  accessToken: string;
  /** Refresh token used to rotate access token */
  refreshToken: string;
};
export type MeUserDto = {
  id: string;
  email: string;
  role: "ADMIN" | "TUTOR" | "STUDENT" | "PARENT";
  nickname: string;
  isActive: boolean;
  isVerified: boolean;
  isFlag: boolean;
  reportCount: number;
  createdAt: string;
};
export type ForgotPasswordResultDto = {
  message: string;
  expiresAt: string;
};
export type ForgotPasswordDto = {
  /** The email address of the user */
  email: string;
};
export type VerifyOtpResultDto = {
  message: string;
  resetToken: string;
};
export type VerifyOtpDto = {
  /** The email address of the user */
  email: string;
  /** The 6-digit OTP code */
  code: string;
};
export type ResetPasswordResultDto = {
  message: string;
  success: boolean;
};
export type ResetPasswordDto = {
  /** The new password for the user */
  newPassword: string;
};
export const {
  useRegisterMutation,
  useLoginMutation,
  useLoginGoogleMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetMeQuery,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = injectedRtkApi;
