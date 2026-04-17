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
    refresh: build.mutation<RefreshApiResponse, RefreshApiArg>({
      query: () => ({ url: `/api/auth/refresh`, method: "POST" }),
    }),
    logout: build.mutation<LogoutApiResponse, LogoutApiArg>({
      query: () => ({ url: `/api/auth/logout`, method: "POST" }),
    }),
    getMe: build.query<GetMeApiResponse, GetMeApiArg>({
      query: () => ({ url: `/api/auth/me` }),
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
    data: UserDto;
  };
export type GetMeApiArg = void;
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
};
export type UserDto = {
  id: number;
  email: string;
  role: "ADMIN" | "TUTOR" | "STUDENT" | "PARENT";
  nickname: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
};
export type LoginResponseDto = {
  /** JWT access token */
  accessToken: string;
  /** Refresh token used to rotate access token */
  refreshToken: string;
  user: UserDto;
};
export type LoginDto = {
  /** The email of the user */
  email: string;
  /** The password of the user */
  password: string;
};
export type AuthTokenPairDto = {
  /** JWT access token */
  accessToken: string;
  /** Refresh token used to rotate access token */
  refreshToken: string;
};
export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetMeQuery,
} = injectedRtkApi;
