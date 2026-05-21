import { baseApi as api } from "../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    createGrade: build.mutation<CreateGradeApiResponse, CreateGradeApiArg>({
      query: (queryArg) => ({
        url: `/api/grades`,
        method: "POST",
        body: queryArg.createGradeDto,
      }),
    }),
    getAllGrades: build.query<GetAllGradesApiResponse, GetAllGradesApiArg>({
      query: () => ({ url: `/api/grades` }),
    }),
    createSubject: build.mutation<
      CreateSubjectApiResponse,
      CreateSubjectApiArg
    >({
      query: (queryArg) => ({
        url: `/api/subjects`,
        method: "POST",
        body: queryArg.createSubjectDto,
      }),
    }),
    getAllSubjects: build.query<
      GetAllSubjectsApiResponse,
      GetAllSubjectsApiArg
    >({
      query: () => ({ url: `/api/subjects` }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as academicCatalogApi };
export type CreateGradeApiResponse =
  /** status 201 Grade created successfully */ {
    success: boolean;
    message: string;
    data: GradeResponseDto;
  };
export type CreateGradeApiArg = {
  createGradeDto: CreateGradeDto;
};
export type GetAllGradesApiResponse = /** status 200 Returns all grades */ {
  success: boolean;
  message: string;
  data: GradeResponseDto[];
};
export type GetAllGradesApiArg = void;
export type CreateSubjectApiResponse =
  /** status 201 Subject created successfully */ {
    success: boolean;
    message: string;
    data: SubjectResponseDto;
  };
export type CreateSubjectApiArg = {
  createSubjectDto: CreateSubjectDto;
};
export type GetAllSubjectsApiResponse =
  /** status 200 Subjects retrieved successfully */ {
    success: boolean;
    message: string;
    data: SubjectResponseDto[];
  };
export type GetAllSubjectsApiArg = void;
export type GradeResponseDto = {
  id: string;
  name: string;
  slug: string;
  order: number;
  createdAt: string;
};
export type CreateGradeDto = {
  name: string;
  slug: string;
  order: number;
};
export type SubjectResponseDto = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};
export type CreateSubjectDto = {
  /** Name of the subject */
  name: string;
  /** Slug of the subject */
  slug: string;
};
export const {
  useCreateGradeMutation,
  useGetAllGradesQuery,
  useCreateSubjectMutation,
  useGetAllSubjectsQuery,
} = injectedRtkApi;
