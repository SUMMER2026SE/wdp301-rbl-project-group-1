import { baseApi as api } from "../../shared/store/baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    storageControllerPresign: build.mutation<
      StorageControllerPresignApiResponse,
      StorageControllerPresignApiArg
    >({
      query: (queryArg) => ({
        url: `/api/storage/files/presign`,
        method: "POST",
        body: queryArg.presignDto,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as storageApi };
export type StorageControllerPresignApiResponse = unknown;
export type StorageControllerPresignApiArg = {
  presignDto: PresignDto;
};
export type PresignDto = {
  /** Original file name */
  filename: string;
  /** Target folder in storage */
  folder: string;
};
export const { useStorageControllerPresignMutation } = injectedRtkApi;
