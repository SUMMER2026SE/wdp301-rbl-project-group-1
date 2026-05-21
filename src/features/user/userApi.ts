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
    updateTutorProfile: build.mutation<
      UpdateTutorProfileApiResponse,
      UpdateTutorProfileApiArg
    >({
      query: (queryArg) => ({
        url: `/api/users/tutor-profile`,
        method: "PATCH",
        body: queryArg.updateTutorProfileDto,
      }),
    }),
    updateStudentProfile: build.mutation<
      UpdateStudentProfileApiResponse,
      UpdateStudentProfileApiArg
    >({
      query: (queryArg) => ({
        url: `/api/users/student-profile`,
        method: "PATCH",
        body: queryArg.updateStudentProfileDto,
      }),
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
export type UpdateTutorProfileApiResponse =
  /** status 200 Tutor profile updated successfully. */ {
    success: boolean;
    message: string;
    data: UpdateProfileResultDto;
  };
export type UpdateTutorProfileApiArg = {
  updateTutorProfileDto: UpdateTutorProfileDto;
};
export type UpdateStudentProfileApiResponse =
  /** status 200 Student profile updated successfully. */ {
    success: boolean;
    message: string;
    data: UpdateProfileResultDto;
  };
export type UpdateStudentProfileApiArg = {
  updateStudentProfileDto: UpdateStudentProfileDto;
};
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
  /** New email address */
  email?: string;
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
export type UpdateTutorProfileDto = {
  /** Bio */
  bio?: string | null;
  /** Specialization subject */
  specialization?: string | null;
  /** Years of experience */
  experience?: number | null;
  /** Educational background */
  education?: string | null;
  /** Price per hour in VND */
  pricePerHour?: number | null;
};
export type UpdateStudentProfileDto = {
  /** School name */
  school?: string | null;
  /** Learning goal */
  learningGoal?: string | null;
  /** List of grade IDs the student wants to study */
  gradeIds?: string[];
  /** List of subject IDs the student is interested in */
  subjectIds?: string[];
};
export const {
  useGetUsersQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangeAvatarMutation,
  useUpgradeTutorMutation,
  useUpdateTutorProfileMutation,
  useUpdateStudentProfileMutation,
} = injectedRtkApi;
