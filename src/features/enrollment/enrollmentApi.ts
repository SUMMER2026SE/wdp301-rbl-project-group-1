import { baseApi as api } from "../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    enrollCourse: build.mutation<EnrollCourseApiResponse, EnrollCourseApiArg>({
      query: (queryArg) => ({
        url: `/api/enrollments`,
        method: "POST",
        body: queryArg.enrollCourseDto,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as enrollmentApi };
export type EnrollCourseApiResponse =
  /** status 201 Student successfully enrolled. */ {
    success: boolean;
    message: string;
    data: EnrollCourseResultDto;
  };
export type EnrollCourseApiArg = {
  enrollCourseDto: EnrollCourseDto;
};
export type EnrollCourseResultDto = {
  /** Enrollment ID */
  id: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  enrolledAt: string;
};
export type EnrollCourseDto = {
  courseId: string;
};
export const { useEnrollCourseMutation } = injectedRtkApi;
