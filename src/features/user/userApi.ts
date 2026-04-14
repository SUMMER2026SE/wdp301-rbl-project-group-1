import { baseApi as api } from "../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<GetUsersApiResponse, GetUsersApiArg>({
      query: () => ({ url: `/api/users` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as userApi };
export type GetUsersApiResponse =
  /** status 200 List of users returned successfully. */ {
    success: boolean;
    message: string;
    data: UserResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
export type GetUsersApiArg = void;
export type UserResponseDto = {
  id: number;
  email: string;
  role: "ADMIN" | "TUTOR" | "STUDENT" | "PARENT";
  nickname: object | null;
  isActive: boolean;
  isVerified: boolean;
  isFlag: boolean;
  reportCount: number;
  createdAt: string;
};
export const { useGetUsersQuery } = injectedRtkApi;
