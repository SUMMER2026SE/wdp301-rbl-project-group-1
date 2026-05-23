import { baseApi as api } from "../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    createCourse: build.mutation<CreateCourseApiResponse, CreateCourseApiArg>({
      query: (queryArg) => ({
        url: `/api/courses`,
        method: "POST",
        body: queryArg.createCourseDto,
      }),
    }),
    getAllCourses: build.query<GetAllCoursesApiResponse, GetAllCoursesApiArg>({
      query: (queryArg) => ({
        url: `/api/courses`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          search: queryArg.search,
          sortBy: queryArg.sortBy,
          sortOrder: queryArg.sortOrder,
          gradeIds: queryArg.gradeIds,
          subjectIds: queryArg.subjectIds,
          status: queryArg.status,
          minPrice: queryArg.minPrice,
          maxPrice: queryArg.maxPrice,
        },
      }),
    }),
    getTutorMeCourses: build.query<
      GetTutorMeCoursesApiResponse,
      GetTutorMeCoursesApiArg
    >({
      query: (queryArg) => ({
        url: `/api/courses/tutor/me`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          search: queryArg.search,
          sortBy: queryArg.sortBy,
          sortOrder: queryArg.sortOrder,
          gradeIds: queryArg.gradeIds,
          subjectIds: queryArg.subjectIds,
          status: queryArg.status,
          minPrice: queryArg.minPrice,
          maxPrice: queryArg.maxPrice,
        },
      }),
    }),
    getTutorCoursesByTutorId: build.query<
      GetTutorCoursesByTutorIdApiResponse,
      GetTutorCoursesByTutorIdApiArg
    >({
      query: (queryArg) => ({
        url: `/api/courses/tutor/${queryArg.id}`,
        params: {
          page: queryArg.page,
          limit: queryArg.limit,
          search: queryArg.search,
          sortBy: queryArg.sortBy,
          sortOrder: queryArg.sortOrder,
          gradeIds: queryArg.gradeIds,
          subjectIds: queryArg.subjectIds,
          status: queryArg.status,
          minPrice: queryArg.minPrice,
          maxPrice: queryArg.maxPrice,
        },
      }),
    }),
    getCourseById: build.query<GetCourseByIdApiResponse, GetCourseByIdApiArg>({
      query: (queryArg) => ({ url: `/api/courses/${queryArg.id}` }),
    }),
    updateCourse: build.mutation<UpdateCourseApiResponse, UpdateCourseApiArg>({
      query: (queryArg) => ({
        url: `/api/courses/${queryArg.id}`,
        method: "PUT",
        body: queryArg.updateCourseDto,
      }),
    }),
    getJoinedStudents: build.query<
      GetJoinedStudentsApiResponse,
      GetJoinedStudentsApiArg
    >({
      query: (queryArg) => ({ url: `/api/courses/${queryArg.id}/students` }),
    }),
    changeCourseStatus: build.mutation<
      ChangeCourseStatusApiResponse,
      ChangeCourseStatusApiArg
    >({
      query: (queryArg) => ({
        url: `/api/courses/${queryArg.courseId}`,
        method: "PATCH",
        body: queryArg.changeCourseStatusDto,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as courseApi };
export type CreateCourseApiResponse =
  /** status 201 Course successfully created. */ {
    success: boolean;
    message: string;
    data: CreateCourseResultDto;
  };
export type CreateCourseApiArg = {
  createCourseDto: CreateCourseDto;
};
export type GetAllCoursesApiResponse =
  /** status 200 List of courses returned successfully. */ {
    success: boolean;
    message: string;
    data: CourseResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
export type GetAllCoursesApiArg = {
  /** Page number (starts from 1) */
  page?: string;
  /** Number of items per page (1–100) */
  limit?: string;
  /** Search keyword */
  search?: string;
  /** Field to sort by */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: "asc" | "desc";
  /** Filter by grade IDs */
  gradeIds?: string | string[];
  /** Filter by subject IDs */
  subjectIds?: string | string[];
  /** Filter by course status */
  status?: "DRAFT" | "PUBLISHED" | "ONGOING" | "CLOSED";
  /** Minimum price filter */
  minPrice?: number;
  /** Maximum price filter */
  maxPrice?: number;
};
export type GetTutorMeCoursesApiResponse =
  /** status 200 List of tutor courses returned successfully. */ {
    success: boolean;
    message: string;
    data: CourseResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
export type GetTutorMeCoursesApiArg = {
  /** Page number (starts from 1) */
  page?: string;
  /** Number of items per page (1–100) */
  limit?: string;
  /** Search keyword */
  search?: string;
  /** Field to sort by */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: "asc" | "desc";
  /** Filter by grade IDs */
  gradeIds?: string | string[];
  /** Filter by subject IDs */
  subjectIds?: string | string[];
  /** Filter by course status */
  status?: "DRAFT" | "PUBLISHED" | "ONGOING" | "CLOSED";
  /** Minimum price filter */
  minPrice?: number;
  /** Maximum price filter */
  maxPrice?: number;
};
export type GetTutorCoursesByTutorIdApiResponse =
  /** status 200 Tutor courses returned successfully. */ {
    success: boolean;
    message: string;
    data: CourseResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
export type GetTutorCoursesByTutorIdApiArg = {
  id: string;
  /** Page number (starts from 1) */
  page?: string;
  /** Number of items per page (1–100) */
  limit?: string;
  /** Search keyword */
  search?: string;
  /** Field to sort by */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: "asc" | "desc";
  /** Filter by grade IDs */
  gradeIds?: string | string[];
  /** Filter by subject IDs */
  subjectIds?: string | string[];
  /** Filter by course status */
  status?: "DRAFT" | "PUBLISHED" | "ONGOING" | "CLOSED";
  /** Minimum price filter */
  minPrice?: number;
  /** Maximum price filter */
  maxPrice?: number;
};
export type GetCourseByIdApiResponse =
  /** status 200 Course returned successfully. */ {
    success: boolean;
    message: string;
    data: CourseResponseDto;
  };
export type GetCourseByIdApiArg = {
  id: string;
};
export type UpdateCourseApiResponse =
  /** status 200 Course updated successfully. */ {
    success: boolean;
    message: string;
    data: UpdateCourseResultDto;
  };
export type UpdateCourseApiArg = {
  id: string;
  updateCourseDto: UpdateCourseDto;
};
export type GetJoinedStudentsApiResponse =
  /** status 200 Joined students returned successfully. */ {
    success: boolean;
    message: string;
    data: GetJoinedStudentsResultDto;
  };
export type GetJoinedStudentsApiArg = {
  id: string;
};
export type ChangeCourseStatusApiResponse =
  /** status 201 Course successfully updated. */ {
    success: boolean;
    message: string;
    data: CreateCourseResultDto;
  };
export type ChangeCourseStatusApiArg = {
  courseId: string;
  changeCourseStatusDto: ChangeCourseStatusDto;
};
export type CreateCourseResultDto = {
  /** The ID of the newly created course */
  id: string;
};
export type CreateCourseDto = {
  /** The title of the course */
  title: string;
  /** The description of the course */
  description?: string;
  /** The price of the course */
  price?: number;
  /** The ID of the subject */
  subjectId: string;
  /** The ID of the grade */
  gradeId: string;
  /** The difficulty level of the course */
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
};
export type CourseResponseDto = {
  id: string;
  tutorId: string;
  tutor: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
  title: string;
  description: string | null;
  price: number | null;
  subjectId: string;
  subjectName: string | null;
  gradeId: string;
  gradeName: string | null;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  status: "DRAFT" | "PUBLISHED" | "ONGOING" | "CLOSED";
  createdAt: string;
};
export type UpdateCourseResultDto = {
  /** The ID of the updated course */
  id: string;
};
export type UpdateCourseDto = {
  /** The title of the course */
  title?: string;
  /** The description of the course */
  description?: string | null;
  /** The price of the course */
  price?: number | null;
  /** The ID of the subject */
  subjectId?: string;
  /** The ID of the grade */
  gradeId?: string;
  /** The difficulty level of the course */
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
};
export type JoinedStudentDto = {
  studentId: string;
  email: string;
  nickname: string | null;
  avatarUrl: string | null;
  school: string | null;
  learningGoal: string | null;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  enrolledAt: string;
};
export type GetJoinedStudentsResultDto = {
  students: JoinedStudentDto[];
};
export type ChangeCourseStatusDto = {
  /** The status of the course */
  status: "DRAFT" | "PUBLISHED" | "ONGOING" | "CLOSED";
};
export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetTutorMeCoursesQuery,
  useGetTutorCoursesByTutorIdQuery,
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
  useGetJoinedStudentsQuery,
  useChangeCourseStatusMutation,
} = injectedRtkApi;
