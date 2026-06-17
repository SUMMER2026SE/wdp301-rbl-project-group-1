import { baseApi as api } from "../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    deleteReviewByAdmin: build.mutation<
      DeleteReviewByAdminApiResponse,
      DeleteReviewByAdminApiArg
    >({
      query: (queryArg) => ({
        url: `/api/admin/reviews/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as adminApi };
export type DeleteReviewByAdminApiResponse =
  /** status 200 Review deleted successfully. */ {
    success: boolean;
    message: string;
    data?: ((null | null) | (object | null)) | null;
  };
export type DeleteReviewByAdminApiArg = {
  id: string;
};
export const { useDeleteReviewByAdminMutation } = injectedRtkApi;
