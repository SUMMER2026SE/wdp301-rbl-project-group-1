import { baseApi as api } from "../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<GetUsersApiResponse, GetUsersApiArg>({
      query: () => ({ url: `/api/users` }),
    }),
    getProfile: build.query<GetProfileApiResponse, GetProfileApiArg>({
      query: () => ({ url: `/api/users/profile` }),
    }),
    updateProfile: build.mutation<
      UpdateProfileApiResponse,
      UpdateProfileApiArg
    >({
      query: (queryArg) => ({
        url: `/api/users/profile`,
        method: "PATCH",
        body: queryArg.updateProfileDto,
      }),
    }),
    changeAvatar: build.mutation<ChangeAvatarApiResponse, ChangeAvatarApiArg>({
      query: (queryArg) => ({
        url: `/api/users/avatar`,
        method: "PATCH",
        body: queryArg.body,
      }),
    }),
    upgradeTutor: build.mutation<UpgradeTutorApiResponse, UpgradeTutorApiArg>({
      query: () => ({ url: `/api/users/me/upgrade-tutor`, method: "PATCH" }),
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
export type GetProfileApiResponse =
  /** status 200 Current user information returned successfully. */ {
    success: boolean;
    message: string;
    data: GetProfileResponseDto;
  };
export type GetProfileApiArg = void;
export type UpdateProfileApiResponse =
  /** status 200 Profile updated successfully. */ {
    success: boolean;
    message: string;
    data: UpdateProfileResultDto;
  };
export type UpdateProfileApiArg = {
  updateProfileDto: UpdateProfileDto;
};
export type ChangeAvatarApiResponse =
  /** status 200 Avatar updated successfully. */ {
    success: boolean;
    message: string;
    data: ChangeAvatarResultDto;
  };
export type ChangeAvatarApiArg = {
  body: {
    avatar?: Blob;
  };
};
export type UpgradeTutorApiResponse =
  /** status 200 User successfully upgraded to tutor. */ {
    success: boolean;
    message: string;
    data: UpgradeTutorResultDto;
  };
export type UpgradeTutorApiArg = void;
export type UserResponseDto = {
  id: string;
  email: string;
  role: "ADMIN" | "TUTOR" | "STUDENT" | "PARENT";
  nickname: string | null;
  isActive: boolean;
  isVerified: boolean;
  isFlag: boolean;
  reportCount: number;
  createdAt: string;
};
export type GetMeProfileDto = {
  nickname: string;
  avatarUrl: string | null;
  phone: string;
  dateOfBirth: string;
  gender: ("MALE" | "FEMALE" | "OTHER") | null;
  address: string | null;
};
export type GetMeTutorInfoDto = {
  bio: string | null;
  specialization: string | null;
  experience: number | null;
  education: string | null;
  pricePerHour: number | null;
  rating: number;
  reviewCount: number;
  studentCount: number;
};
export type SubjectRefDto = {
  id: string;
  name: string;
  slug: string;
};
export type GradeRefDto = {
  id: string;
  name: string;
  slug: string;
  order: number;
};
export type GetMeStudentInfoDto = {
  school: string | null;
  learningGoal: string | null;
  /** Enrolled subjects */
  subjects: SubjectRefDto[];
  /** Grade levels */
  grades: GradeRefDto[];
};
export type GetMeParentInfoDto = {
  phone: string | null;
  address: string | null;
};
export type GetProfileResponseDto = {
  id: string;
  email: string;
  role: "ADMIN" | "TUTOR" | "STUDENT" | "PARENT";
  isActive: boolean;
  isVerified: boolean;
  isFlag: boolean;
  reportCount: number;
  createdAt: string;
  profile: GetMeProfileDto | null;
  tutor: GetMeTutorInfoDto | null;
  student: GetMeStudentInfoDto | null;
  parent: GetMeParentInfoDto | null;
};
export type UpdateProfileResultDto = {
  /** User id */
  id: string;
  /** Result message */
  message: string;
};
export type UpdateProfileDto = {
  /** Nickname */
  nickname?: string;
  /** Avatar URL */
  avatarUrl?: string;
  /** Phone number */
  phone?: string;
  /** Date of birth */
  dateOfBirth?: string;
  /** Gender */
  gender?: "MALE" | "FEMALE" | "OTHER";
  /** Address */
  address?: string;
};
export type ChangeAvatarResultDto = {
  /** User Id */
  userId: string;
  /** The secure URL of the new avatar */
  avatarUrl: string;
};
export type UpgradeTutorResultDto = {
  /** Indicates whether the upgrade was successful */
  success: boolean;
};
export const {
  useGetUsersQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangeAvatarMutation,
  useUpgradeTutorMutation,
} = injectedRtkApi;
